import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-200 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col w-full gap-2 justify-center items-center">
          <h1 className="text-3xl font-semibold">Agnos Test</h1>
          <h2 className="text-xl font-semibold mb-6">Appointment Form & Monitoring</h2>
          <Button className="w-[200px]"><Link href={'/patient/appointment'}>Patient Path</Link></Button>
          <Button className="w-[200px]"><Link href={'/admin'}>Admin Path</Link></Button>
        </div>
      </main>
    </div>
  );
}
