import Image from "next/image";
import productImage from "../../../public/assets/productImage.jpg";
import Link from "next/link";
const ProductShowcase = () => {
  return (
    <section className="w-full bg-gradient-to-b from-[#FFFFFF] to-[#D2DCFF] py-24">
      <div className="container">
        <Link href="#" className="flex py-5 justify-center">
          <strong className="text-center text-sm font-bold tracking-tighter px-2 py-1 rounded-xl bg-slate-400 border-slate-500 bg-opacity-20 text-gray-500">
            ¡Empeza hoy mismo!
          </strong>
        </Link>
        <div className="flex px-5">
          <h1 className="title">Nuestros Servicios</h1>
        </div>

        <p className="text-center text-[20px] leading-[30px] tracking-tight text-[#010D3E] py-5">
          Simplifica la gestión de tus pacientes organiza tus horarios, manten
          historiales y citas médicas y optimiza tu tiempo con una interfaz
          intuitiva y funcional. Descubre cómo nuestra solución puede ayudarte a
          brindar una atención más eficiente, personalizada y sin
          complicaciones.
        </p>

        <Image src={productImage} alt="product-image"
        className="py-5"
        />
      </div>
    </section>
  );
};

export default ProductShowcase;
