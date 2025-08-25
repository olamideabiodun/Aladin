import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import ProductForm from "@/components/ProductForm";
import ProductList from "@/components/ProductList";

export default async function AdminPage() {
  const session = await auth();

  // Type guard for user with role uhhhhh
  const user = session?.user as { role?: string } | undefined;

  if (!session || user?.role !== "ADMIN") {
    redirect("/");
  }

  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <ProductForm />
      <ProductList products={products} />
    </div>
  );
}