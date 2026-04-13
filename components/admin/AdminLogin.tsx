'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createPhoneToken, verifyPhoneAndSetCookie } from '@/lib/auth/cookies';
import { verifyOTPServerAction } from '@/app/actions/verify-otp';
import { getAdminPhonesServerAction } from '@/app/actions/get-admin-phones';

export default function AdminLogin() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [allowedPhones, setAllowedPhones] = useState<string[]>([]);
  const [isLoadingPhones, setIsLoadingPhones] = useState(true);

  // Fetch allowed phones from server config on mount
  useEffect(() => {
    const fetchPhones = async () => {
      try {
        const phones = await getAdminPhonesServerAction();
        // Strip the +57 prefix to match input format
        const cleanedPhones = phones.map((phone) => phone.replace(/^57/, ''));
        setAllowedPhones(cleanedPhones);
      } catch (err) {
        console.error('Error fetching allowed phones:', err);
        setError('Error cargando la configuración. Intenta más tarde.');
      } finally {
        setIsLoadingPhones(false);
      }
    };

    fetchPhones();
  }, []);

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = event.target.value.replace(/\D/g, '');
    setPhoneNumber(cleaned);
  };

  const handleEditPhoneNumber = () => {
    setUserId(null);
    setOtp('');
    setError(null);
  };

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError(null);

    if (!allowedPhones.includes(phoneNumber)) {
      setError('Número no autorizado para acceder al admin');
      setIsSending(false);
      return;
    }

    try {
      const result = await createPhoneToken(`57${phoneNumber}`);
      if (result.success) {
        setUserId(result.userId ?? null);
      } else {
        setError('Error al enviar código');
      }
    } catch {
      setError('Error inesperado');
    }
    setIsSending(false);
  };

  const verifyOtpHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError(null);

    try {
      // Call server action to verify OTP (all verification happens server-side)
      const result = await verifyOTPServerAction(userId!, otp);
      if (result.success) {
        // OTP verified and auth cookie set by server action
        // Now verify phone and complete login flow
        const userResult = await verifyPhoneAndSetCookie(phoneNumber);
        if (userResult.success) {
          router.push('/admin/productos');
          router.refresh();
        } else {
          setError(userResult.error || 'Error verificando usuario');
        }
      } else {
        setError(result.error || 'Código inválido');
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError('Error de verificación');
    }
    setIsVerifying(false);
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col items-center justify-center text-center space-y-4 mb-8 w-full">
        <Image
          src="/serviteka-logo.png"
          alt="Serviteka San Pedro"
          width={250}
          height={50}
          style={{ width: '250px', height: 'auto' }}
          priority
        />
        <h1 className="text-2xl font-bold text-neutral-900">Admin Panel</h1>
        <p className="text-neutral-600 text-sm">Ingresa con tu número de WhatsApp</p>
      </div>

      {!userId ? (
        <div className="space-y-4">
          <form onSubmit={requestOtp} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-neutral-700 block mb-2">Teléfono</label>
              <div className="flex items-center gap-2 border border-neutral-300 rounded-lg px-3 py-2 bg-white">
                <span className="text-neutral-700 font-medium text-sm">+57</span>
                <Input
                  type="tel"
                  placeholder="Ej: 3001234567"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  required
                  className="border-0 p-0 focus:ring-0 bg-white text-neutral-900 placeholder:text-neutral-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={!phoneNumber || isSending || isLoadingPhones}
              className={`w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 rounded-lg transition-all ${
                isSending || isLoadingPhones ? 'cursor-not-allowed opacity-50' : ''
              }`}
            >
              {isSending ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Enviando...
                </div>
              ) : (
                'Enviar código por WhatsApp'
              )}
            </Button>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-neutral-600 text-center">Ingresa el código de 6 dígitos que recibiste en WhatsApp</p>
          <form onSubmit={verifyOtpHandler} className="space-y-4">
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              type="submit"
              disabled={!otp || isVerifying}
              className={`w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 rounded-lg transition-all ${
                isVerifying ? 'cursor-not-allowed opacity-50' : ''
              }`}
            >
              {isVerifying ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Verificando...
                </div>
              ) : (
                'Verificar código'
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleEditPhoneNumber}
              className="w-full mt-2 text-neutral-600"
            >
              Cambiar número
            </Button>
          </form>
        </div>
      )}

      {error && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
    </div>
  );
}
