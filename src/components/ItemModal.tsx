import { ShoppingItem } from "@prisma/client";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { api } from "~/utils/api";

interface ItemModalProps {
    setModalOpen: Dispatch<SetStateAction<boolean>>;
    setItems: Dispatch<SetStateAction<ShoppingItem[]>>;
}

export const ItemModal: FC<ItemModalProps> = ({ setModalOpen, setItems }) => {

    const [input, setInput] = useState<string>("");
    const { mutate: addItem } = api.shoppingItem.addItem.useMutation({
        onSuccess: (data) => {
            setItems((prev) => [...prev, data]);
        }
    });

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black/75">
            <div className="space-y-4 p-3 bg-white">
                <h3 className="text-xl font-semibold">Name of item</h3>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full rounded-md bg-gray-200 border-gray-300 shadow-sm focus:border-violet-300 focus:ring" />
                <div className="grid grid-cols-2 m-2 gap-8">
                    <button
                        type="button"
                        onClick={() => setModalOpen(false)}
                        className="rounded-md bg-gray-500 p-1 text-xs text-white transition hover:bg-gray-600">
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            addItem({ name: input })
                            setModalOpen(false)
                        }}
                        className="rounded-md bg-violet-500 p-1 text-xs text-white transition hover:bg-violet-600">
                        Add
                    </button>
                </div>
            </div>
        </div>
    )
}