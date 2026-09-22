import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, MapPin, Clock, CheckCircle, MessageCircle } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^\d{10,15}$/, 'Phone must be 10-15 digits'),
  subject: z.string().max(200, 'Subject must be less than 200 characters').optional().or(z.literal('')),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must be less than 1000 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validatedData = contactSchema.parse(formData);
      
      // Create WhatsApp message with form data
      const whatsappMessage = `🙏 New Inquiry from Adhvika Store Website

*Name:* ${validatedData.name}
*Email:* ${validatedData.email}
*Phone:* ${validatedData.phone}
*Subject:* ${validatedData.subject}

*Message:*
${validatedData.message}`;

      // Open WhatsApp with the message
      const whatsappUrl = `https://wa.me/917337377689?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');
      
      setIsSubmitted(true);
      toast.success('Redirecting to WhatsApp...');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof ContactFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      value: '7337377689',
      href: 'tel:+917337377689',
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'adhvikageneralstore@gmail.com',
      href: 'mailto:adhvikageneralstore@gmail.com',
    },
    {
      icon: MapPin,
      title: 'Address',
      value: 'New Bus Stand Road, Lokeshwaram',
      href: 'https://maps.app.goo.gl/mMtpPBbKjj9XYnzM9',
    },
    {
      icon: Clock,
      title: 'Hours',
      value: 'Mon - Sun: 8:00 AM - 8:00 PM',
      href: null,
    },
  ];

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3"
          >
            Get in Touch
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-muted-foreground max-w-xl mx-auto"
          >
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <CardContent className="p-6 md:p-8">
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center h-full py-12">
                    <div className="h-16 w-16 rounded-full bg-success/20 flex items-center justify-center mb-4">
                      <CheckCircle className="h-8 w-8 text-success" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-foreground mb-2">Thank You!</h3>
                    <p className="text-muted-foreground text-center max-w-sm">
                      Your message has been received. We'll get back to you within 24 hours.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-6"
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                      }}
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="text-center mb-6">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-display text-2xl font-bold tracking-tight text-foreground mb-1">Send Us a Message</h3>
                      <p className="text-sm text-muted-foreground">Fill out the form and we'll get back to you via WhatsApp</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          className={errors.name ? 'border-destructive' : ''}
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your@gmail.com"
                          className={errors.email ? 'border-destructive' : ''}
                        />
                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="1234567890"
                          className={errors.phone ? 'border-destructive' : ''}
                        />
                        {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="How can we help?"
                          className={errors.subject ? 'border-destructive' : ''}
                        />
                        {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Your message..."
                        rows={5}
                        className={errors.message ? 'border-destructive' : ''}
                      />
                      {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
                    </div>
                    <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info & Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Contact Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              {contactInfo.map((info, i) => (
                <Card key={i} className="group hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <info.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-foreground tracking-wide">{info.title}</h4>
                        {info.href ? (
                          <a
                            href={info.href}
                            target={info.href.startsWith('http') ? '_blank' : undefined}
                            rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="text-sm text-foreground hover:text-primary transition-colors break-words"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-sm text-foreground">{info.value}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Visit Our Store Card */}
            <Card className="overflow-hidden bg-gradient-to-br from-primary/5 via-background to-amber-50/30 border-primary/20">
              <CardContent className="p-6 md:p-8">
                <div className="text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <MapPin className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-foreground mb-2">Visit Our Store</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Experience our products in person at our store in Lokeshwaram. We're open 7 days a week to serve you!
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                    <a
                      href="https://maps.app.goo.gl/mMtpPBbKjj9XYnzM9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium"
                    >
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>New Bus Stand Road, Lokeshwaram</span>
                    </a>
                    <a
                      href="tel:+917337377689"
                      className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium"
                    >
                      <Phone className="h-5 w-5 text-primary" />
                      <span>Call: 7337377689</span>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp CTA */}
            <Card className="bg-success border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-success-foreground/20 flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-success-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-success-foreground">Quick Response on WhatsApp</h4>
                      <p className="text-sm text-success-foreground/80">Chat with us for instant support</p>
                    </div>
                  </div>
                  <Button
                    asChild
                    variant="secondary"
                    className="bg-success-foreground text-success hover:bg-success-foreground/90 shrink-0"
                  >
                    <a
                      href="https://wa.me/917337377689?text=Hello!%20I%20would%20like%20to%20know%20more%20about%20Adhvika%20General%20Store%20and%20your%20products.%20%F0%9F%99%8F"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Chat Now
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
