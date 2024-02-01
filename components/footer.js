export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-darkest w-full text-center text-black p-2">
      <div className="flex flex-1 mx-auto">&copy; {currentYear} Dev by Cedo</div>
    </footer>
  );
}