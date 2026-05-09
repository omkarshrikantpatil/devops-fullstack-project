import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, UserPlus, Building2 } from 'lucide-react';
import { realAuthApi } from '@/api/realAuthApi';

const professionOptions = [
  'Chartered Accountants',
  'Company Secretary',
  'Tax Return Preparers',
  'Tax Consultants',
  'Accountants',
  'Other',
];

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    membershipNumber: '',
    profession: '',
    pan: '',
    telephone: '',
    mobile: '',
    email: '',
    officeAddress: '',
    pinCode: '',
    state: '',
    whatsappLink: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validatePAN = (pan: string) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan.toUpperCase());
  };

  const validateMobile = (mobile: string) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  };

  const validatePinCode = (pinCode: string) => {
    const pinCodeRegex = /^[1-9][0-9]{5}$/;
    return pinCodeRegex.test(pinCode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast({ title: 'Error', description: 'Name is required', variant: 'destructive' });
      return;
    }

    if (!formData.dateOfBirth) {
      toast({ title: 'Error', description: 'Date of Birth is required', variant: 'destructive' });
      return;
    }

    if (!formData.profession) {
      toast({ title: 'Error', description: 'Please select your profession', variant: 'destructive' });
      return;
    }

    if (!validatePAN(formData.pan)) {
      toast({ title: 'Error', description: 'Please enter a valid PAN (e.g., ABCDE1234F)', variant: 'destructive' });
      return;
    }

    if (!validateMobile(formData.mobile)) {
      toast({ title: 'Error', description: 'Please enter a valid 10-digit mobile number', variant: 'destructive' });
      return;
    }

    if (!formData.email || !formData.email.includes('@')) {
      toast({ title: 'Error', description: 'Please enter a valid email address', variant: 'destructive' });
      return;
    }

    if (!formData.officeAddress.trim()) {
      toast({ title: 'Error', description: 'Office Address is required', variant: 'destructive' });
      return;
    }

    if (!validatePinCode(formData.pinCode)) {
      toast({ title: 'Error', description: 'Please enter a valid 6-digit PIN code', variant: 'destructive' });
      return;
    }

    if (!formData.state) {
      toast({ title: 'Error', description: 'Please select your state', variant: 'destructive' });
      return;
    }

    if (formData.password.length < 6) {
      toast({ title: 'Error', description: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Call real API for CA registration
      const response = await realAuthApi.registerCA({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        dobOrDoi: formData.dateOfBirth,
        membershipNumber: formData.membershipNumber,
        profession: formData.profession === 'Chartered Accountants' ? 'Chartered Accountant' : formData.profession,
        pan: formData.pan.toUpperCase(),
        telephone: formData.telephone,
        mobile: formData.mobile,
        officeAddress: formData.officeAddress,
        pinCode: formData.pinCode,
        state: formData.state,
        whatsappLink: formData.whatsappLink || `https://wa.me/91${formData.mobile}`,
      });

      toast({
        title: 'Registration Successful!',
        description: response.message || 'Your account has been created. Please sign in with your PAN and password.',
      });

      navigate('/login');
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: error instanceof Error ? error.message : 'An error occurred during registration',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-primary p-4 py-8">
      <div className="w-full max-w-2xl animate-fade-in">
        {/* Logo/Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">CA Platform</h1>
          <p className="text-white/70 mt-2">Create your account</p>
        </div>

        {/* Registration Card */}
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold text-center">CA Registration</CardTitle>
            <CardDescription className="text-center">
              Fill in your details to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="h-10"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth *</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    className="h-10"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Membership Number */}
                <div className="space-y-2">
                  <Label htmlFor="membershipNumber">Membership Number</Label>
                  <Input
                    id="membershipNumber"
                    placeholder="Enter membership number"
                    value={formData.membershipNumber}
                    onChange={(e) => handleChange('membershipNumber', e.target.value)}
                    className="h-10"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Profession */}
                <div className="space-y-2">
                  <Label htmlFor="profession">Profession *</Label>
                  <Select
                    value={formData.profession}
                    onValueChange={(value) => handleChange('profession', value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select profession" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                      {professionOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* PAN */}
                <div className="space-y-2">
                  <Label htmlFor="pan">PAN * (Used as Username)</Label>
                  <Input
                    id="pan"
                    placeholder="e.g., ABCDE1234F"
                    value={formData.pan}
                    onChange={(e) => handleChange('pan', e.target.value.toUpperCase())}
                    className="h-10 uppercase"
                    maxLength={10}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Telephone */}
                <div className="space-y-2">
                  <Label htmlFor="telephone">Telephone</Label>
                  <Input
                    id="telephone"
                    placeholder="Enter telephone number"
                    value={formData.telephone}
                    onChange={(e) => handleChange('telephone', e.target.value)}
                    className="h-10"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Mobile */}
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile *</Label>
                  <Input
                    id="mobile"
                    placeholder="Enter 10-digit mobile number"
                    value={formData.mobile}
                    onChange={(e) => handleChange('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="h-10"
                    maxLength={10}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="h-10"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Office Address - Full Width */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="officeAddress">Office Address *</Label>
                  <Input
                    id="officeAddress"
                    placeholder="Enter your office address"
                    value={formData.officeAddress}
                    onChange={(e) => handleChange('officeAddress', e.target.value)}
                    className="h-10"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Pin Code */}
                <div className="space-y-2">
                  <Label htmlFor="pinCode">PIN Code *</Label>
                  <Input
                    id="pinCode"
                    placeholder="Enter 6-digit PIN code"
                    value={formData.pinCode}
                    onChange={(e) => handleChange('pinCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="h-10"
                    maxLength={6}
                    disabled={isSubmitting}
                  />
                </div>

                {/* State */}
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) => handleChange('state', value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50 max-h-60">
                      {indianStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* WhatsApp Link */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="whatsappLink">WhatsApp Link</Label>
                  <Input
                    id="whatsappLink"
                    placeholder="e.g., https://wa.me/919876543210"
                    value={formData.whatsappLink}
                    onChange={(e) => handleChange('whatsappLink', e.target.value)}
                    className="h-10"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      className="h-10 pr-10"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      className="h-10 pr-10"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 gradient-primary hover:opacity-90 transition-opacity mt-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Create Account
                  </div>
                )}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-white/60 text-sm mt-6">
          © 2024 CA Platform. All rights reserved.
        </p>
      </div>
    </div>
  );
}
