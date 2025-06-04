import Image from "next/image";
import productImage from "../../../public/assets/productImage.png";
import Link from "next/link";
const ProductShowcase = () => {
  return (
    <section className="w-full bg-gradient-to-b from-[#FFFFFF] to-[#D2DCFF] py-24">
      <div className="container">
        <div className="max-w-[640px] mx-auto">
        <Link href="#" className="flex py-5 justify-center">
          <strong className="text-center text-sm font-bold tracking-tighter px-2 py-1 rounded-xl bg-slate-400 border-gray-500 border-[1px] bg-opacity-20 text-gray-500">
            ¡Empeza hoy mismo!
          </strong>
        </Link>
        <div className="w-full flex px-5">
          <h1 className="w-full flex items-center mx-auto justify-center text-5xl sm:text-6xl  xl:text-7xl font-semibold bg-gradient-to-b from-gray-600 to-[#5a8bbd] text-transparent text-center bg-clip-text">Nuestros Servicios</h1>
        </div>

        <p className="w-[70%] mx-auto text-center text-sm leading-[20px] tracking-tight text-gray-500 py-5">
          Simplifica la gestión de tus pacientes, organiza tus horarios, manten
          historiales y citas médicas y optimiza tu tiempo con una interfaz
          intuitiva y funcional. Descubre cómo nuestra solución puede ayudarte a
          brindar una atención más eficiente, personalizada y sin
          complicaciones.
        </p>

        </div>
        <Image src={productImage} alt="product-image"
        className="w-[90%] mx-auto rounded-md py-5 flex items-center justify-center"
        />
      </div>
    </section>
  );
};

export default ProductShowcase;
