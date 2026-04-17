import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Logo } from "../components/layout/Logo";

export default function NotFound() {
  return (
    <div className="min-h-full flex flex-col">
      <div className="p-6"><Logo /></div>
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <p className="text-[72px] font-semibold text-brand-500 leading-none">404</p>
        <h1 className="mt-4 text-[22px] font-semibold text-ink">Page introuvable</h1>
        <p className="mt-2 text-[14px] text-[color:var(--color-muted)] max-w-md">
          Cette page n'existe pas ou a été déplacée.
        </p>
        <Link to="/" className="mt-6">
          <Button>Retour à l'accueil</Button>
        </Link>
      </div>
    </div>
  );
}
