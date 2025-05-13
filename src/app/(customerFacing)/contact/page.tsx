'use client'

import { Mail, Phone, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        message: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Form data submitted:', formData)
        // Add actual API call logic here
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-6">
            <div className="w-full max-w-5xl bg-white rounded-3xl ">
                <div className="mb-20 text-center">
                    <h1 className="text-4xl font-bold mb-4 text-gray-900">Contact Us</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        We’d love to hear from you! Fill out the form below and our team will get back to you soon.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="bg-white border border-gray-300 focus:border-gray-500 shadow-sm"
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="bg-white border border-gray-300 focus:border-gray-500 shadow-sm"
                        />
                    </div>

                    {/* Company */}
                    <div className="flex flex-col gap-1 sm:col-span-2">
                        <Label htmlFor="company">Company (optional)</Label>
                        <Input
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Your Company Name"
                            className="bg-white border border-gray-300 focus:border-gray-500 shadow-sm"
                        />
                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-1 sm:col-span-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="How can we help you?"
                            rows={6}
                            className="bg-white border border-gray-300 focus:border-gray-500 shadow-sm resize-none"
                        />
                    </div>

                    {/* Submit */}
                    <div className="sm:col-span-2 text-center">
                        <Button type="submit" className="px-10 py-2 text-base rounded-xl">
                            Send Message
                        </Button>
                    </div>
                </form>

                {/* Contact Info */}
                <div className="mt-14 border-t pt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-700 text-sm text-center">
                    <div className="flex flex-col items-center gap-1">
                        <Phone className="w-5 h-5 text-gray-500" />
                        <span>+91 98765 43210</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <Mail className="w-5 h-5 text-gray-500" />
                        <span>support@example.com</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <span>Bengaluru, India</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
