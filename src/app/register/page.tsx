'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { Mail, Lock, Eye, EyeOff, Check, X } from 'lucide-react';
import Link from 'next/link';
import { authService } from '@/services/authService';
import { validateEmail } from '@/lib/utils';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const passwordStrength = {
    hasUpperCase: /[A-Z]/.test(formData.password),
    hasLowerCase: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSpecialChar: /[!@#$%^&*]/.test(formData.password),
    isLongEnough: formData.password.length >= 8,
  };

  const isPasswordStrong = Object.values(passwordStrength).filter(Boolean).length >= 4;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        throw new Error('Please fill in all fields');
      }

      if (!validateEmail(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      if (!isPasswordStrong) {
        throw new Error('Password does not meet strength requirements');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (!agreeTerms) {
        throw new Error('Please agree to the terms and conditions');
      }

      await authService.register({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">🏥 Fittrustmedicals</h1>
          <p className="text-gray-600">Create your account</p>
        </div>

        <Card className="space-y-6">
          {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="John"
                required
              />
              <Input
                label="Last Name"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Doe"
                required
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              icon={<Mail size={20} />}
              placeholder="you@example.com"
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                icon={<Lock size={20} />}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {formData.password && (
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <p className="text-xs font-medium text-gray-700">Password requirements:</p>
                <ul className="space-y-1 text-xs">
                  <li className="flex items-center gap-2">
                    {passwordStrength.hasUpperCase ? <Check size={14} className="text-green-600" /> : <X size={14} className="text-red-600" />}
                    <span>Uppercase letter</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {passwordStrength.hasLowerCase ? <Check size={14} className="text-green-600" /> : <X size={14} className="text-red-600" />}
                    <span>Lowercase letter</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {passwordStrength.hasNumber ? <Check size={14} className="text-green-600" /> : <X size={14} className="text-red-600" />}
                    <span>Number</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {passwordStrength.hasSpecialChar ? <Check size={14} className="text-green-600" /> : <X size={14} className="text-red-600" />}
                    <span>Special character (!@#$%)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {passwordStrength.isLongEnough ? <Check size={14} className="text-green-600" /> : <X size={14} className="text-red-600" />}
                    <span>At least 8 characters</span>
                  </li>
                </ul>
              </div>
            )}

            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {formData.confirmPassword && (
              <div className="text-sm">
                {formData.password === formData.confirmPassword ? (
                  <p className="text-green-600 flex items-center gap-2"><Check size={16} /> Passwords match</p>
                ) : (
                  <p className="text-red-600 flex items-center gap-2"><X size={16} /> Passwords do not match</p>
                )}
              </div>
            )}

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">
                I agree to the <Link href="/terms" className="text-blue-600 hover:underline">Terms & Conditions</Link> and{' '}
                <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <Button fullWidth size="lg" isLoading={loading} type="submit" disabled={!isPasswordStrong || !agreeTerms}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}