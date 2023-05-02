import { useStateContext } from "../contexts/ContextProvider"

export default function Toast() {
    const { toast, setToast } = useStateContext();



    return (
        <>
            {toast.show && (
                <div className="py-2 px-3 text-white rounded bg-emerald-500 fixed right-2 bottom-2 w-[300px] z-50 animate-fade-in-down">
                    {toast.message}
                </div>
            )}
        </>
    )
}
