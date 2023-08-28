import { ShoppingItem } from "@prisma/client";
import Head from "next/head";
import { useEffect, useState } from "react";
import { ItemModal } from "~/components/ItemModal";
import { api } from "~/utils/api";
import { HiX } from "react-icons/hi";
import { motion } from "framer-motion";

export default function Home() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<ShoppingItem[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const { data: itemsData, isLoading } = api.shoppingItem.fetchItems.useQuery();

  const { mutate: deleteItem } = api.shoppingItem.deleteItem.useMutation({
    onSuccess: (data) => {
      setItems((prev) => prev.filter((item) => item.id !== data.id));
    }
  });

  const { mutate: checkItem } = api.shoppingItem.toggleCheck.useMutation({
    onSuccess: (data) => {
      if (checkedItems.some(item => item.id === data.id)) {
        setCheckedItems((prev) => prev.filter((item) => item.id !== data.id));
      } else {
        setCheckedItems((prev) => [...prev, data]);
      }
    }
  });

  useEffect(() => {
    if (!!itemsData) {
      setItems(itemsData);
      const checked = itemsData.filter(item => item.checked);
      setCheckedItems(checked);
    }
  }, [itemsData]);

  if (!itemsData && isLoading) return <p>Loading...</p>

  return (
    <>
      <Head>
        <title>Shopping List</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {modalOpen && <ItemModal setModalOpen={setModalOpen} setItems={setItems} />}

      <main className="mx-auto my-12 max-w-3xl">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold">My shopping list</h2>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="bg-violet-500 p-2 text-white text-sm rounded-md transition hover:bg-violet">
            Add shopping item
          </button>
        </div>

        <ul className="mt-4">
          {items.map((item) => {
            const { id, name, checked } = item;
            return (
              <li key={id} className="flex w-full items-center justify-between">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-0 flex origin-left items-center justify-center" >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: checkedItems.some(item => item.id === id) ? "100%" : 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="h-[2px] w-full translate-y-px bg-red-500"
                    />
                  </div>
                  <span onClick={() => checkItem({ id, checked: checkedItems.some(item => item.id === id) ? false : true })}>{name}</span>
                </div>
                <HiX onClick={() => deleteItem({ id })} className="text-lg text-red-500 cursor-pointer" />
              </li>
            )
          })}
        </ul>
      </main>
    </>
  );
}