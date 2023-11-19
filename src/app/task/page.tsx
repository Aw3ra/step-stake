import Image from 'next/image'
// Import the pdf image from step-stake\public\pdf.png, then display it at full screen
export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-black text-white">
        <div className="relative flex place-items-center">
            <Image
            className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
            src="/task.png"
            alt="PDF image"
            width={900}
            height={1200}
            priority
            />
        </div>
        </main>
    )
    }
