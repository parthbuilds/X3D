import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";

interface ContactItemProps {
  icon: React.ReactNode;
  text: string;
}

export default function ContactSection() {
  return (
    <section className="bg-white py-12 px-6 md:px-12 rounded-xl shadow-md mx-auto contact">
      <h2 className="text-3xl font-bold text-center mb-4">Get in Touch</h2>
      <p className="text-center text-gray-500 mb-8">Have any questions or want to work with us? Drop us a message!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <form className="space-y-4">
          <Input type="text" placeholder="Full Name" required className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-3" />
          <Input type="email" placeholder="Email Address" required className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-3" />
          <Textarea placeholder="Your Message" rows={5} required className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-3" />
          <Button className="w-full">Submit</Button>
        </form>

        <div className="space-y-6">
          <ContactItem icon={<Mail />} text="contact@company.com" />
          <ContactItem icon={<Phone />} text="+123 456 7890" />
          <ContactItem icon={<MapPin />} text="123 Main St, City, Country" />
        </div>
      </div>
    </section>
  );
}

function ContactItem({ icon, text }: ContactItemProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="p-2 bg-gray-100 rounded-full">{icon}</div>
      <p className="text-gray-600">{text}</p>
    </div>
  );
}  
