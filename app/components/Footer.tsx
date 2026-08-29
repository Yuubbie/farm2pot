const DEVELOPER_WHATSAPP = "234XXXXXXXXXX"; // TODO: replace with Yubbie's real WhatsApp number (international format, no + or spaces)

export default function Footer() {
  return (
    <footer className="bg-charcoal px-6 py-8 text-center sm:px-12 lg:px-20">
      <p className="font-body text-xs text-cream/40">
        &copy; {new Date().getFullYear()} Farm2Pot And Grill. All rights
        reserved.
      </p>
      <p className="mt-2 font-body text-xs text-cream/30">
        Built by{" "}
        <a
          href={`https://wa.me/${DEVELOPER_WHATSAPP}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-dotted hover:text-cream/60"
        >
          Yubbie Pen &amp; Pixel
        </a>
      </p>
    </footer>
  );
}
