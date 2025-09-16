interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  contentClassName?: string;
  containerClassName?: string;
}

const Modal = ({
  onClose,
  children,
  contentClassName = "",
  containerClassName = "",
}: ModalProps) => {
  return (
    <div
      className={`fixed inset-0 bg-black/50 flex justify-center items-start z-50 ${containerClassName}`}
    >
      <div
        className={`bg-dark-800 p-8 rounded-lg max-w-2xl w-full relative mt-20 ${contentClassName}`}
      >
        <button
          className="absolute top-2 right-2 text-cyber-400 hover:text-white"
          onClick={onClose}
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
