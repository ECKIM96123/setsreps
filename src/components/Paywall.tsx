import React, { useEffect, useState } from "react";

type PaywallProps = {
  onPurchase: (receipt: string) => void;
  loading: boolean;
};

type Product = {
  id: string;
  title: string;
  price: string;
  description: string;
};

export const Paywall: React.FC<PaywallProps> = ({ onPurchase, loading }) => {
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Dina produkt-ID:n från App Store Connect
  const productIds = ["sr_monthly", "sr_annually"];

  useEffect(() => {
    if (!(window as any).store) return;
    (window as any).store.register(
      productIds.map((id) => ({
        id,
        type: (window as any).store.PAID_SUBSCRIPTION,
      }))
    );
    (window as any).store.ready(() => {
      const prods = productIds
        .map((id) => (window as any).store.get(id))
        .filter((prod: any) => prod)
        .map((prod: any) => ({
          id: prod.id,
          title: prod.title,
          price: prod.price,
          description: prod.description,
        }));
      setProducts(prods);
      if (prods.length > 0) setSelectedProductId(prods[0].id);
    });
    (window as any).store.refresh();
  }, []);

  const handleBuy = () => {
    setError(null);
    if (!(window as any).store) {
      setError("In-App Purchase är inte tillgängligt.");
      return;
    }
    if (!selectedProductId) {
      setError("Välj en prenumeration först.");
      return;
    }
    (window as any).store.order(selectedProductId);
    (window as any).store.when(selectedProductId).approved((order: any) => {
      order.verify();
    });
    (window as any).store.when(selectedProductId).verified((order: any) => {
      const receipt = order.transaction && order.transaction.appStoreReceipt;
      if (receipt) {
        onPurchase(receipt);
      }
      order.finish();
    });
  };

  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <h2>Bli Premium</h2>
      {products.length > 0 ? (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
            {products.map((product) => (
              <label key={product.id} style={{ border: selectedProductId === product.id ? "2px solid #0070f3" : "1px solid #ccc", borderRadius: 8, padding: 12, cursor: "pointer" }}>
                <input
                  type="radio"
                  name="product"
                  value={product.id}
                  checked={selectedProductId === product.id}
                  onChange={() => setSelectedProductId(product.id)}
                  style={{ marginRight: 8 }}
                />
                <b>{product.title}</b> – {product.price}
                <div style={{ fontSize: 14, color: "#666" }}>{product.description}</div>
              </label>
            ))}
          </div>
          <button onClick={handleBuy} disabled={loading || !selectedProductId}>
            {loading ? "Köper..." : "Köp"}
          </button>
        </>
      ) : (
        <p>Hämtar produktinfo...</p>
      )}
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </div>
  );
}; 