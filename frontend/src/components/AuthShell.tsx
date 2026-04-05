import { ReactNode } from "react";

interface AuthShellProps {
  title: string;
  description: string;
  sideTitle: string;
  sideText: string;
  sideFooter: string;
  accent?: "blue" | "purple" | "indigo";
  children: ReactNode;
}

export default function AuthShell({
  title,
  description,
  sideTitle,
  sideText,
  sideFooter,
  accent = "blue",
  children,
}: AuthShellProps) {
  const accentMap = {
    blue: "from-slate-900 via-slate-800 to-blue-900",
    purple: "from-purple-900 via-slate-800 to-slate-900",
    indigo: "from-indigo-900 via-purple-800 to-slate-900",
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#e2e8f0,_#f8fafc,_#dbeafe)] flex items-center justify-center p-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">
        <section
          className={`hidden md:flex flex-col justify-between bg-gradient-to-br ${accentMap[accent]} p-10 text-white`}
        >
          <div>
            <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-sm">
              Eventos App
            </span>
            <h2 className="mt-6 text-4xl font-bold leading-tight">
              {sideTitle}
            </h2>
            <p className="mt-4 text-sm text-slate-200">{sideText}</p>
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/10 p-5">
            <p className="text-sm text-slate-100">{sideFooter}</p>
          </div>
        </section>

        <section className="flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md rounded-3xl border border-white/40 bg-white/80 p-8 shadow-2xl backdrop-blur-md">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {title}
              </h1>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                {description}
              </p>
            </div>

            {children}
          </div>
        </section>
      </div>
    </main>
  );
}