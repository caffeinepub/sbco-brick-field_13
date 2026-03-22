import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import {
  ArrowLeft,
  BarChart2,
  CalendarDays,
  CheckCircle,
  ClipboardList,
  ClipboardPlus,
  Clock,
  Layers,
  LayoutGrid,
  Package,
  Pencil,
  Settings,
  Trash2,
  Truck,
  Wallet,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type View = "dashboard" | "add-order" | "direct-delivery" | "total-orders";

type BrickType =
  | "1 No Bricks"
  | "2 No Bricks"
  | "3 No Bricks"
  | "1 No Picket"
  | "2 No Picket"
  | "Crack"
  | "Goria"
  | "Bats";

const BRICK_TYPES: BrickType[] = [
  "1 No Bricks",
  "2 No Bricks",
  "3 No Bricks",
  "1 No Picket",
  "2 No Picket",
  "Crack",
  "Goria",
  "Bats",
];

interface BrickSelection {
  type: BrickType;
  quantity: number;
  safety?: number;
}

interface Order {
  id: string;
  orderDate: string;
  customerName: string;
  address: string;
  phoneNumber: string;
  invoiceNumber: string;
  approxDeliveryDate: string;
  bricks: BrickSelection[];
  totalBricks: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  locationType: "Local" | "Outside";
  createdAt: Date;
}

function useLiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateShort(dateStr: string) {
  if (!dateStr) return "—";
  const [y, m, day] = dateStr.split("-");
  return `${day}/${m}/${y}`;
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getTodayISO() {
  return new Date().toISOString().split("T")[0];
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  clickable?: boolean;
  onClick?: () => void;
  "data-ocid"?: string;
}

function StatCard({
  icon,
  title,
  value,
  clickable = true,
  onClick,
  "data-ocid": ocid,
}: StatCardProps) {
  return (
    <motion.div
      data-ocid={ocid}
      whileHover={clickable ? { y: -2 } : {}}
      whileTap={clickable ? { scale: 0.97 } : {}}
      onClick={clickable ? onClick : undefined}
      className={[
        "bg-card rounded-xl shadow-card p-3 flex flex-col gap-1 select-none",
        clickable
          ? "cursor-pointer hover:shadow-card-hover transition-shadow duration-200"
          : "cursor-default",
      ].join(" ")}
    >
      <div className="w-8 h-8 rounded-lg bg-brand-mint-badge flex items-center justify-center">
        {icon}
      </div>
      <p className="text-[10px] font-bold uppercase tracking-wide text-foreground mt-0.5">
        {title}
      </p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </motion.div>
  );
}

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  "data-ocid"?: string;
}

function ActionCard({
  icon,
  title,
  subtitle,
  onClick,
  "data-ocid": ocid,
}: ActionCardProps) {
  return (
    <motion.div
      data-ocid={ocid}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="bg-card rounded-xl shadow-card p-3 flex flex-col items-center gap-1 cursor-pointer hover:shadow-card-hover transition-shadow duration-200 select-none"
    >
      <div className="w-10 h-10 rounded-lg bg-brand-mint-badge flex items-center justify-center">
        {icon}
      </div>
      <p className="text-[10px] font-bold uppercase tracking-wide text-foreground text-center">
        {title}
      </p>
      <p className="text-[10px] text-muted-foreground text-center">
        {subtitle}
      </p>
    </motion.div>
  );
}

function SettingsModal({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent data-ocid="settings.modal" className="max-w-sm mx-4">
        <DialogHeader>
          <DialogTitle className="uppercase tracking-widest text-foreground">
            Settings
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-2">
          {["Language", "Notifications", "Theme", "About"].map((item) => (
            <button
              type="button"
              key={item}
              className="text-left px-4 py-3 rounded-xl bg-brand-mint-badge text-foreground font-medium hover:opacity-80 transition-opacity"
              onClick={() => toast.info(`${item} — coming soon`)}
            >
              {item}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ReportsModal({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent data-ocid="reports.modal" className="max-w-sm mx-4">
        <DialogHeader>
          <DialogTitle className="uppercase tracking-widest text-foreground">
            Reports
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-2">
          {[
            "Daily Report",
            "Weekly Summary",
            "Monthly Overview",
            "Export Data",
          ].map((item) => (
            <button
              type="button"
              key={item}
              className="text-left px-4 py-3 rounded-xl bg-brand-mint-badge text-foreground font-medium hover:opacity-80 transition-opacity"
              onClick={() => toast.info(`${item} — coming soon`)}
            >
              {item}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Add Order Page ───────────────────────────────────────────────────────────

function AddOrderPage({
  onBack,
  onSave,
}: { onBack: () => void; onSave: (order: Order) => void }) {
  const [orderDate, setOrderDate] = useState(getTodayISO());

  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [approxDeliveryDate, setApproxDeliveryDate] = useState("");
  const [selectedBricks, setSelectedBricks] = useState<Set<BrickType>>(
    new Set(),
  );
  const [quantities, setQuantities] = useState<
    Partial<Record<BrickType, number>>
  >({});
  const [totalAmount, setTotalAmount] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [locationType, setLocationType] = useState<"Local" | "Outside">(
    "Local",
  );

  const dueAmount = (Number(totalAmount) || 0) - (Number(paidAmount) || 0);

  const totalBricks = BRICK_TYPES.reduce((sum, type) => {
    if (type === "Bats") return sum;
    if (selectedBricks.has(type)) {
      return sum + (quantities[type] || 0);
    }
    return sum;
  }, 0);

  const totalBatsSafety = selectedBricks.has("Bats") ? quantities.Bats || 0 : 0;

  const toggleBrick = (type: BrickType) => {
    setSelectedBricks((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const setQty = (type: BrickType, val: string) => {
    setQuantities((prev) => ({ ...prev, [type]: Number(val) || 0 }));
  };

  const handleSave = () => {
    if (!customerName.trim()) {
      toast.error("Customer Name is required");
      return;
    }
    if (!phoneNumber.trim()) {
      toast.error("Phone Number is required");
      return;
    }
    if (!invoiceNumber.trim()) {
      toast.error("Invoice Number is required");
      return;
    }

    const bricks: BrickSelection[] = BRICK_TYPES.filter((t) =>
      selectedBricks.has(t),
    ).map((type) => ({
      type,
      quantity: quantities[type] || 0,
      ...(type === "Bats" ? { safety: quantities[type] || 0 } : {}),
    }));

    const order: Order = {
      id: `ORD-${Date.now()}`,
      orderDate,
      customerName: customerName.trim(),
      address: address.trim(),
      phoneNumber: phoneNumber.trim(),
      invoiceNumber: invoiceNumber.trim(),
      approxDeliveryDate,
      bricks,
      totalBricks,
      totalAmount: Number(totalAmount) || 0,
      paidAmount: Number(paidAmount) || 0,
      dueAmount,
      locationType,
      createdAt: new Date(),
    };

    onSave(order);
    toast.success("Order saved successfully!");
    onBack();
  };

  return (
    <motion.div
      key="add-order"
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 60, opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="min-h-screen bg-background flex flex-col"
    >
      <header className="bg-primary text-primary-foreground px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button
          type="button"
          data-ocid="add_order.back.button"
          onClick={onBack}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold uppercase tracking-widest">
          ADD ORDER
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto pb-8">
        <div className="mx-4 mt-4 bg-card rounded-xl shadow-card px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CalendarDays size={18} className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              ORDER DATE
            </span>
          </div>
          <Input
            data-ocid="add_order.order_date.input"
            type="date"
            className="h-9 w-auto rounded-lg border-border bg-background text-sm font-semibold text-foreground text-right"
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
          />
        </div>

        <div className="mx-4 mt-4">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2 px-1">
            CUSTOMER INFORMATION
          </p>
          <div className="bg-card rounded-xl shadow-card px-4 py-4 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Name *
                </Label>
                <Input
                  data-ocid="add_order.customer_name.input"
                  className="mt-1 h-10 rounded-lg border-border bg-background"
                  placeholder="Full name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Address
                </Label>
                <Input
                  data-ocid="add_order.address.input"
                  className="mt-1 h-10 rounded-lg border-border bg-background"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Phone *
                </Label>
                <Input
                  data-ocid="add_order.phone.input"
                  type="tel"
                  inputMode="numeric"
                  className="mt-1 h-10 rounded-lg border-border bg-background"
                  placeholder="01XXXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Invoice *
                </Label>
                <Input
                  data-ocid="add_order.invoice.input"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="mt-1 h-10 rounded-lg border-border bg-background"
                  placeholder="INV-001"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Approx Delivery Date
              </Label>
              <Input
                data-ocid="add_order.delivery_date.input"
                type="date"
                className="mt-1 h-10 rounded-lg border-border bg-background"
                value={approxDeliveryDate}
                onChange={(e) => setApproxDeliveryDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mx-4 mt-4">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2 px-1">
            BRICK TYPES
          </p>
          <div className="grid grid-cols-2 gap-2">
            {BRICK_TYPES.map((type) => {
              const isSelected = selectedBricks.has(type);
              const isBats = type === "Bats";
              return (
                <div key={type} className="flex flex-col">
                  <button
                    type="button"
                    data-ocid={`brick.${type.toLowerCase().replace(/ /g, "_")}.toggle`}
                    onClick={() => toggleBrick(type)}
                    className={[
                      "w-full rounded-xl px-3 py-2.5 text-sm font-bold transition-all duration-150 select-none border",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-card text-foreground border-border hover:border-primary/40",
                    ].join(" ")}
                  >
                    {type}
                  </button>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-1.5 bg-card rounded-lg border border-primary/30 px-2 py-1.5">
                          <Label className="text-[10px] font-bold uppercase tracking-wide text-primary">
                            {isBats ? "Safety" : "Quantity"}
                          </Label>
                          <Input
                            data-ocid={`brick.${type.toLowerCase().replace(/ /g, "_")}.input`}
                            type="number"
                            min="0"
                            placeholder="0"
                            className="mt-0.5 h-8 rounded-md border-border bg-background text-sm"
                            value={quantities[type] || ""}
                            onChange={(e) => setQty(type, e.target.value)}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="mt-3 bg-primary/10 border border-primary/30 rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wide text-primary">
              TOTAL BRICKS
            </span>
            <span className="text-xl font-extrabold text-primary">
              {totalBricks.toLocaleString()}
            </span>
          </div>

          <AnimatePresence>
            {selectedBricks.has("Bats") && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: "auto", opacity: 1, marginTop: 8 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="bg-amber-500/10 border border-amber-500/40 rounded-xl px-4 py-3 flex items-center justify-between">
                  <span className="text-sm font-bold uppercase tracking-wide text-amber-700">
                    TOTAL BATS SAFETY
                  </span>
                  <span className="text-xl font-extrabold text-amber-700">
                    {totalBatsSafety.toLocaleString()}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mx-4 mt-4">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2 px-1">
            PAYMENT DETAILS
          </p>
          <div className="bg-card rounded-xl shadow-card px-4 py-4 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                Total Amount
              </Label>
              <Input
                data-ocid="add_order.total_amount.input"
                type="number"
                min="0"
                placeholder="0"
                className="w-36 h-10 rounded-lg border-border bg-background text-right"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                Paid Amount
              </Label>
              <Input
                data-ocid="add_order.paid_amount.input"
                type="number"
                min="0"
                placeholder="0"
                className="w-36 h-10 rounded-lg border-border bg-background text-right"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
              />
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Due Amount
              </Label>
              <span className="text-lg font-extrabold text-primary">
                ₹{dueAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="mx-4 mt-4">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2 px-1">
            LOCATION TYPE
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              data-ocid="add_order.local.toggle"
              onClick={() => setLocationType("Local")}
              className={[
                "flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all",
                locationType === "Local"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border",
              ].join(" ")}
            >
              Local
            </button>
            <button
              type="button"
              data-ocid="add_order.outside.toggle"
              onClick={() => setLocationType("Outside")}
              className={[
                "flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all",
                locationType === "Outside"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border",
              ].join(" ")}
            >
              Outside
            </button>
          </div>
        </div>

        <div className="mx-4 mt-6">
          <button
            type="button"
            data-ocid="add_order.save.submit_button"
            onClick={handleSave}
            className="w-full py-4 rounded-full bg-primary text-primary-foreground text-base font-extrabold uppercase tracking-widest shadow-card hover:opacity-90 active:scale-95 transition-all"
          >
            SAVE ORDER
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Add Payment Dialog ───────────────────────────────────────────────────────

function AddPaymentDialog({
  open,
  order,
  onClose,
  onConfirm,
}: {
  open: boolean;
  order: Order | null;
  onClose: () => void;
  onConfirm: (orderId: string, amount: number) => void;
}) {
  const [amount, setAmount] = useState("");

  const handleConfirm = () => {
    if (!order) return;
    const val = Number(amount);
    if (!val || val <= 0) {
      toast.error("Enter a valid payment amount");
      return;
    }
    onConfirm(order.id, val);
    setAmount("");
    onClose();
    toast.success("Payment added successfully!");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          setAmount("");
          onClose();
        }
      }}
    >
      <DialogContent data-ocid="add_payment.dialog" className="max-w-sm mx-4">
        <DialogHeader>
          <DialogTitle className="uppercase tracking-widest text-foreground">
            Add Payment
          </DialogTitle>
        </DialogHeader>
        {order && (
          <div className="py-2 flex flex-col gap-3">
            <div className="bg-brand-mint-badge rounded-xl px-4 py-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                Customer
              </p>
              <p className="font-bold text-foreground text-sm mt-0.5">
                {order.customerName}
              </p>
              <div className="flex gap-4 mt-2">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    Current Due
                  </p>
                  <p className="font-extrabold text-destructive text-base">
                    ₹{order.dueAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    Paid So Far
                  </p>
                  <p className="font-bold text-foreground text-base">
                    ₹{order.paidAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Payment Amount
              </Label>
              <Input
                data-ocid="add_payment.input"
                type="number"
                min="0"
                inputMode="numeric"
                placeholder="Enter amount"
                className="mt-1 h-11 rounded-lg border-border bg-background text-base font-bold"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
              />
            </div>
          </div>
        )}
        <DialogFooter className="flex gap-2">
          <button
            type="button"
            data-ocid="add_payment.cancel_button"
            onClick={() => {
              setAmount("");
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold border border-border bg-card text-foreground hover:opacity-80 transition-opacity"
          >
            Cancel
          </button>
          <button
            type="button"
            data-ocid="add_payment.confirm_button"
            onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Confirm
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Total Orders Page ────────────────────────────────────────────────────────

function TotalOrdersPage({
  orders,
  onBack,
  onUpdateOrder,
  onDeleteOrder,
}: {
  orders: Order[];
  onBack: () => void;
  onUpdateOrder: (updatedOrder: Order) => void;
  onDeleteOrder: (orderId: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [activeFrom, setActiveFrom] = useState("");
  const [activeTo, setActiveTo] = useState("");
  const [paymentOrder, setPaymentOrder] = useState<Order | null>(null);

  const filtered = orders.filter((o) => {
    const matchSearch = o.customerName
      .toLowerCase()
      .includes(search.toLowerCase());
    let matchDate = true;
    if (activeFrom) matchDate = matchDate && o.orderDate >= activeFrom;
    if (activeTo) matchDate = matchDate && o.orderDate <= activeTo;
    return matchSearch && matchDate;
  });

  const handleApplyFilter = () => {
    setActiveFrom(filterFrom);
    setActiveTo(filterTo);
  };

  const handleAddPayment = (orderId: string, amount: number) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    const newPaid = order.paidAmount + amount;
    const newDue = order.totalAmount - newPaid;
    onUpdateOrder({
      ...order,
      paidAmount: newPaid,
      dueAmount: newDue < 0 ? 0 : newDue,
    });
  };

  const handleDelete = (order: Order) => {
    onDeleteOrder(order.id);
    toast.success(`Order for ${order.customerName} deleted`);
  };

  return (
    <motion.div
      key="total-orders"
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 60, opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="min-h-screen bg-background flex flex-col"
    >
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button
          type="button"
          data-ocid="total_orders.back.button"
          onClick={onBack}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold uppercase tracking-widest">
          ORDER DETAILS
        </h1>
        <span className="ml-auto bg-white/20 text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full">
          {orders.length}
        </span>
      </header>

      <main className="flex-1 px-3 pt-3 pb-8 flex flex-col gap-3">
        {/* Search */}
        <div className="relative">
          <Input
            data-ocid="total_orders.search_input"
            placeholder="Search by customer name..."
            className="w-full h-11 rounded-full border-border bg-card pl-4 pr-4 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter by Date */}
        <div className="bg-card rounded-2xl shadow-card px-4 py-4">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-primary mb-3">
            FILTER BY DATE
          </p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                FROM
              </Label>
              <Input
                data-ocid="total_orders.filter_from.input"
                type="date"
                className="mt-1 h-9 rounded-xl border-border bg-background text-sm"
                value={filterFrom}
                onChange={(e) => setFilterFrom(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                TO
              </Label>
              <Input
                data-ocid="total_orders.filter_to.input"
                type="date"
                className="mt-1 h-9 rounded-xl border-border bg-background text-sm"
                value={filterTo}
                onChange={(e) => setFilterTo(e.target.value)}
              />
            </div>
          </div>
          <button
            type="button"
            data-ocid="total_orders.apply_filter.button"
            onClick={handleApplyFilter}
            className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-extrabold uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all"
          >
            APPLY FILTER
          </button>
        </div>

        {/* Orders list */}
        {filtered.length === 0 ? (
          <motion.div
            data-ocid="total_orders.empty_state"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center gap-4 mt-12"
          >
            <div className="w-20 h-20 rounded-2xl bg-brand-mint-badge flex items-center justify-center">
              <ClipboardList size={36} className="text-primary" />
            </div>
            <p className="text-lg font-bold text-foreground text-center uppercase tracking-wide">
              {orders.length === 0 ? "No orders yet" : "No results found"}
            </p>
            <p className="text-sm text-muted-foreground text-center">
              {orders.length === 0
                ? "Add your first order using the Add Order button."
                : "Try adjusting your search or filter."}
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((order, i) => (
              <motion.div
                key={order.id}
                data-ocid={`total_orders.item.${i + 1}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-card rounded-2xl shadow-card overflow-hidden"
              >
                {/* Card Header — green tint */}
                <div className="bg-brand-mint-badge px-4 py-3 flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold text-foreground leading-tight truncate">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {order.address || "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* History */}
                    <button
                      type="button"
                      data-ocid={`total_orders.item.${i + 1}.history.button`}
                      onClick={() => toast.info("History — coming soon")}
                      className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                    >
                      <Clock size={14} className="text-primary" />
                    </button>
                    {/* Edit */}
                    <button
                      type="button"
                      data-ocid={`total_orders.item.${i + 1}.edit_button`}
                      onClick={() => toast.info("Edit — coming soon")}
                      className="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:opacity-80 transition-opacity"
                    >
                      <Pencil size={13} className="text-primary-foreground" />
                    </button>
                    {/* Delete */}
                    <button
                      type="button"
                      data-ocid={`total_orders.item.${i + 1}.delete_button`}
                      onClick={() => handleDelete(order)}
                      className="w-8 h-8 rounded-full bg-destructive flex items-center justify-center hover:opacity-80 transition-opacity"
                    >
                      <Trash2 size={13} className="text-white" />
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="px-4 py-3 flex flex-col gap-3">
                  {/* 4-column info row */}
                  <div className="grid grid-cols-4 gap-1">
                    {(
                      [
                        ["PHONE", order.phoneNumber || "—"],
                        ["INVOICE", order.invoiceNumber || "—"],
                        ["ORDER DATE", formatDateShort(order.orderDate)],
                        [
                          "APPROX DEL.",
                          formatDateShort(order.approxDeliveryDate),
                        ],
                      ] as [string, string][]
                    ).map(([label, val]) => (
                      <div key={label}>
                        <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground leading-tight">
                          {label}
                        </p>
                        <p className="text-[11px] font-extrabold text-foreground leading-tight mt-0.5 truncate">
                          {val}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Brick types header */}
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-extrabold uppercase tracking-wide text-foreground">
                      BRICK TYPES &amp; QTY
                    </p>
                    <span className="text-[9px] font-extrabold uppercase tracking-wide bg-destructive text-white px-2.5 py-0.5 rounded-full">
                      PENDING
                    </span>
                  </div>

                  {/* Brick pills */}
                  {order.bricks.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {order.bricks.map((b) => (
                        <span
                          key={b.type}
                          className="text-[10px] bg-brand-mint-badge text-primary font-bold px-3 py-1 rounded-full border border-primary/20"
                        >
                          {b.type}: {b.quantity.toLocaleString()}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      No brick types selected
                    </p>
                  )}

                  {/* Divider */}
                  <div className="h-px bg-border" />

                  {/* 5-column stats row */}
                  <div className="grid grid-cols-5 gap-1">
                    {(
                      [
                        ["BRICKS", order.totalBricks.toLocaleString(), false],
                        [
                          "BRICKS DUE",
                          order.totalBricks.toLocaleString(),
                          false,
                        ],
                        [
                          "TOTAL AMT",
                          `₹${order.totalAmount.toLocaleString()}`,
                          false,
                        ],
                        [
                          "PAID",
                          `₹${order.paidAmount.toLocaleString()}`,
                          false,
                        ],
                        ["DUE", `₹${order.dueAmount.toLocaleString()}`, true],
                      ] as [string, string, boolean][]
                    ).map(([label, val, isDue]) => (
                      <div key={label} className="text-center">
                        <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground leading-tight">
                          {label}
                        </p>
                        <p
                          className={[
                            "text-[11px] font-extrabold leading-tight mt-0.5",
                            isDue ? "text-destructive" : "text-foreground",
                          ].join(" ")}
                        >
                          {val}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Add Payment button */}
                  <button
                    type="button"
                    data-ocid={`total_orders.item.${i + 1}.add_payment.button`}
                    onClick={() => setPaymentOrder(order)}
                    className="w-full py-2.5 rounded-xl bg-brand-mint-badge text-primary text-xs font-extrabold uppercase tracking-widest border border-primary/20 hover:bg-primary/10 active:scale-95 transition-all"
                  >
                    ₹ ADD PAYMENT
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Add Payment Dialog */}
      <AddPaymentDialog
        open={paymentOrder !== null}
        order={paymentOrder}
        onClose={() => setPaymentOrder(null)}
        onConfirm={handleAddPayment}
      />
    </motion.div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState<View>("dashboard");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const now = useLiveClock();

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const updateOrder = (updated: Order) => {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const handleCardClick = (name: string) => {
    toast.info(`${name} — coming soon`, { duration: 2000 });
  };

  const iconClass = "text-primary";
  const iconSize = 18;

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {view === "dashboard" ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col min-h-screen"
          >
            <header className="pt-5 pb-2 px-4 text-center">
              <h1 className="text-xl font-extrabold uppercase tracking-[0.2em] text-primary leading-tight">
                S B C O BRICK FIELD
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary mt-0.5">
                ORDERS &amp; BRICK MANAGEMENT
              </p>
              <div className="mt-1.5 mx-auto w-4/5 h-px bg-primary/30" />
              <p className="mt-1.5 text-sm font-semibold text-primary">
                {formatDate(now)} | {formatTime(now)}
              </p>
            </header>

            <main className="flex-1 px-3 pb-24 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <StatCard
                  data-ocid="total_orders.card"
                  icon={<ClipboardList size={iconSize} className={iconClass} />}
                  title="Total Orders"
                  value={String(orders.length)}
                  clickable
                  onClick={() => setView("total-orders")}
                />
                <StatCard
                  data-ocid="closed_orders.card"
                  icon={<CheckCircle size={iconSize} className={iconClass} />}
                  title="Closed Orders"
                  value="0"
                  clickable
                  onClick={() => handleCardClick("Closed Orders")}
                />
                <StatCard
                  data-ocid="pending_delivery.card"
                  icon={<Truck size={iconSize} className={iconClass} />}
                  title="Pending Delivery"
                  value="0"
                  clickable
                  onClick={() => handleCardClick("Pending Delivery")}
                />
                <StatCard
                  data-ocid="complete_delivery.card"
                  icon={<Package size={iconSize} className={iconClass} />}
                  title="Complete Delivery"
                  value="0"
                  clickable
                  onClick={() => handleCardClick("Complete Delivery")}
                />
                <StatCard
                  data-ocid="total_due.card"
                  icon={<Wallet size={iconSize} className={iconClass} />}
                  title="Total Due Amount"
                  value="₹0"
                  clickable={false}
                />
                <StatCard
                  data-ocid="bricks_due.card"
                  icon={<Layers size={iconSize} className={iconClass} />}
                  title="Bricks Due"
                  value="0"
                  clickable={false}
                />
                <ActionCard
                  data-ocid="settings.open_modal_button"
                  icon={<Settings size={20} className={iconClass} />}
                  title="Settings"
                  subtitle="Tap to open"
                  onClick={() => setSettingsOpen(true)}
                />
                <ActionCard
                  data-ocid="reports.open_modal_button"
                  icon={<BarChart2 size={20} className={iconClass} />}
                  title="Reports"
                  subtitle="Tap to open"
                  onClick={() => setReportsOpen(true)}
                />
              </div>
            </main>

            <nav className="fixed bottom-0 left-0 right-0 bg-primary flex items-center justify-around py-3 px-4 shadow-lg z-50">
              <button
                type="button"
                data-ocid="nav.dashboard.tab"
                className="flex flex-col items-center gap-1 flex-1 py-1"
              >
                <LayoutGrid size={22} className="text-primary-foreground" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                  Dashboard
                </span>
              </button>
              <button
                type="button"
                data-ocid="nav.add_order.button"
                onClick={() => setView("add-order")}
                className="flex flex-col items-center gap-1 flex-1 py-1 opacity-70 hover:opacity-100 transition-opacity"
              >
                <ClipboardPlus size={22} className="text-primary-foreground" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                  Add Order
                </span>
              </button>
              <button
                type="button"
                data-ocid="nav.direct_delivery.button"
                onClick={() => setView("direct-delivery")}
                className="flex flex-col items-center gap-1 flex-1 py-1 opacity-70 hover:opacity-100 transition-opacity"
              >
                <Truck size={22} className="text-primary-foreground" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                  Direct Delivery
                </span>
              </button>
            </nav>
          </motion.div>
        ) : view === "add-order" ? (
          <AddOrderPage
            key="add-order"
            onBack={() => setView("dashboard")}
            onSave={addOrder}
          />
        ) : view === "total-orders" ? (
          <TotalOrdersPage
            key="total-orders"
            orders={orders}
            onBack={() => setView("dashboard")}
            onUpdateOrder={updateOrder}
            onDeleteOrder={deleteOrder}
          />
        ) : (
          <motion.div
            key="direct-delivery"
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 60, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="min-h-screen bg-background flex flex-col"
          >
            <header className="bg-primary text-primary-foreground px-4 py-5 flex items-center gap-3">
              <button
                type="button"
                data-ocid="nav.back.button"
                onClick={() => setView("dashboard")}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-lg font-bold uppercase tracking-widest">
                Direct Delivery
              </h1>
            </header>
            <main className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
              <div className="w-20 h-20 rounded-2xl bg-brand-mint-badge flex items-center justify-center">
                <Truck size={36} className="text-primary" />
              </div>
              <p className="text-xl font-bold text-foreground text-center uppercase tracking-wide">
                Coming Soon
              </p>
              <p className="text-sm text-muted-foreground text-center">
                This feature is under development.
              </p>
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      <ReportsModal open={reportsOpen} onClose={() => setReportsOpen(false)} />
      <Toaster position="top-center" />

      {view === "dashboard" && (
        <div className="fixed bottom-[72px] left-0 right-0 text-center py-1 text-[10px] text-muted-foreground bg-background/80 backdrop-blur-sm">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </div>
      )}
    </div>
  );
}
