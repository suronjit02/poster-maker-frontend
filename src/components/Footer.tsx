export default function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-6 py-8 text-center text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} Poster
          <span className="font-semibold text-foreground">Maker</span> — AI
          দিয়ে প্রফেশনাল রাজনৈতিক পোস্টার তৈরি করুন
        </p>
      </div>
    </footer>
  );
}
