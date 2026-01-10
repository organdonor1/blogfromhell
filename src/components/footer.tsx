import MailingListSignup from './MailingListSignup';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border mt-16">
      <div className="container max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div className="text-center">
          <h3 className="font-serif text-lg mb-2">Stay Updated</h3>
          <p className="text-muted-foreground text-sm mb-4">Get new fiction and news delivered to your inbox.</p>
          <MailingListSignup />
        </div>
        <p className="text-center text-muted-foreground text-sm font-body">
          © {currentYear} From Hell. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
