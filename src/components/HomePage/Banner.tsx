import Image from "next/image";

export default function Banner() {
    return (
        <section className="text-center h-[400px] bg-blue-600 text-white items-center flex flex-col justify-center mb-12">
            <div className="relative mb-6 overflow-hidden rounded-xl">
            </div>
            <h2 className="text-4xl font-bold mb-4">
                Best Products for You
            </h2>
            <p className="mb-6">Buy your favorite items with best price</p>
            <button className="bg-white text-blue-600 px-6 py-2 rounded">
                Shop Now
            </button>
        </section>
    );
}