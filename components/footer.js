export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-darkest w-full text-center text-black p-2">
      <div className="flex flex-1 mx-auto">&copy; {currentYear} Dev by Cedo</div>
      <a className="inline-block right-0 align-baseline font-bold text-sm text-500 text-gray-700 hover:text-blue-600" href="/support">
                  Support
                </a>
    </footer>
  );
}