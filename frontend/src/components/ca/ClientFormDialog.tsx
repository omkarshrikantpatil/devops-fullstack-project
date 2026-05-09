import { useState, useEffect } from 'react';
import { Client } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

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

interface ClientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  onSubmit: (data: Partial<Client>) => Promise<void>;
}

export function ClientFormDialog({
  open,
  onOpenChange,
  client,
  onSubmit,
}: ClientFormDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    panNumber: '',
    gstNumber: '',
    phone: '',
    mobile: '',
    email: '',
    address: '',
    pinCode: '',
    state: '',
    type: 'individual' as 'individual' | 'business',
  });

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        dateOfBirth: client.dateOfBirth,
        panNumber: client.panNumber,
        gstNumber: client.gstNumber || '',
        phone: client.phone,
        mobile: client.mobile,
        email: client.email,
        address: client.address,
        pinCode: client.pinCode,
        state: client.state,
        type: client.type,
      });
    } else {
      setFormData({
        name: '',
        dateOfBirth: '',
        panNumber: '',
        gstNumber: '',
        phone: '',
        mobile: '',
        email: '',
        address: '',
        pinCode: '',
        state: '',
        type: 'individual',
      });
    }
  }, [client, open]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

    if (!formData.name.trim()) {
      toast({ title: 'Error', description: 'Name is required', variant: 'destructive' });
      return;
    }

    if (!formData.dateOfBirth) {
      toast({ title: 'Error', description: 'Date of Birth is required', variant: 'destructive' });
      return;
    }

    if (!validatePAN(formData.panNumber)) {
      toast({ title: 'Error', description: 'Please enter a valid PAN', variant: 'destructive' });
      return;
    }

    if (!validateMobile(formData.mobile)) {
      toast({ title: 'Error', description: 'Please enter a valid 10-digit mobile number', variant: 'destructive' });
      return;
    }

    if (!formData.email || !formData.email.includes('@')) {
      toast({ title: 'Error', description: 'Please enter a valid email', variant: 'destructive' });
      return;
    }

    if (!formData.address.trim()) {
      toast({ title: 'Error', description: 'Address is required', variant: 'destructive' });
      return;
    }

    if (!validatePinCode(formData.pinCode)) {
      toast({ title: 'Error', description: 'Please enter a valid PIN code', variant: 'destructive' });
      return;
    }

    if (!formData.state) {
      toast({ title: 'Error', description: 'Please select state', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: formData.name,
        dateOfBirth: formData.dateOfBirth,
        panNumber: formData.panNumber.toUpperCase(),
        gstNumber: formData.gstNumber || undefined,
        phone: formData.phone,
        mobile: formData.mobile,
        email: formData.email,
        address: formData.address,
        pinCode: formData.pinCode,
        state: formData.state,
        type: formData.type,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{client ? 'Edit Client' : 'Add New Client'}</DialogTitle>
          <DialogDescription>
            {client ? 'Update client information' : 'Enter client details to register'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
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
                disabled={isSubmitting}
              />
            </div>

            {/* PAN */}
            <div className="space-y-2">
              <Label htmlFor="pan">PAN *</Label>
              <Input
                id="pan"
                placeholder="e.g., ABCDE1234F"
                value={formData.panNumber}
                onChange={(e) => handleChange('panNumber', e.target.value.toUpperCase())}
                className="uppercase"
                maxLength={10}
                disabled={isSubmitting}
              />
            </div>

            {/* GST Number */}
            <div className="space-y-2">
              <Label htmlFor="gst">GST Number</Label>
              <Input
                id="gst"
                placeholder="Enter GST number (optional)"
                value={formData.gstNumber}
                onChange={(e) => handleChange('gstNumber', e.target.value.toUpperCase())}
                className="uppercase"
                disabled={isSubmitting}
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Client Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange('type', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Telephone</Label>
              <Input
                id="phone"
                placeholder="Enter telephone number"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* Mobile */}
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile *</Label>
              <Input
                id="mobile"
                placeholder="Enter 10-digit mobile"
                value={formData.mobile}
                onChange={(e) => handleChange('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
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
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* Address - Full Width */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                placeholder="Enter full address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
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
                <SelectTrigger>
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
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="gradient-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Saving...
                </div>
              ) : (
                client ? 'Update Client' : 'Add Client'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
