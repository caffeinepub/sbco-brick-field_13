import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  CreditCard,
  Download,
  Layers,
  LayoutGrid,
  MapPin,
  Package,
  Pencil,
  Phone,
  Printer,
  Settings,
  Trash2,
  Truck,
  Upload,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
type View =
  | "dashboard"
  | "add-order"
  | "direct-delivery"
  | "total-orders"
  | "pending-order"
  | "pending-delivery"
  | "complete-delivery"
  | "completed-list"
  | "settings"
  | "daily-labour-report"
  | "weekly-labour-report"
  | "closed-orders"
  | "reports";

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
  paymentHistory?: { date: string; time: string; amount: number }[];
  deliveredBricks?: number;
  completionData?: {
    vehicleType: "Tractor" | "12 Wheel" | null;
    vehicleNumber: string | null;
    loadingLabours: string[];
    unloadingLabours: string[];
    paymentStatus: "Not Paid" | "Paid Money";
    rate: number;
    totalAmount: number;
    loadingShare: number;
    unloadingShare: number;
    perLoadingLabour: number;
    perUnloadingLabour: number;
    deliveryDate?: string;
  };
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

interface Vehicle {
  id: string;
  type: "Tractor" | "12 Wheel";
  number: string;
  loadingLabors: string[];
  unloadingLabors?: string[];
}

interface TrashItem {
  id: string;
  type: "order" | "delivery" | "closedOrder" | "completedDelivery";
  item: any;
  deletedAt: string;
}

interface SettingsPageProps {
  onBack: () => void;
  trash: TrashItem[];
  setTrash: React.Dispatch<React.SetStateAction<TrashItem[]>>;
  lastBackupTime: string;
  setLastBackupTime: React.Dispatch<React.SetStateAction<string>>;
}

function SettingsPage({
  onBack,
  trash,
  setTrash,
  lastBackupTime,
  setLastBackupTime,
}: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState<"vehicles" | "rates" | "backup">(
    "vehicles",
  );
  const [vehicleType, setVehicleType] = useState<"Tractor" | "12 Wheel">(
    "Tractor",
  );
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [laborInput, setLaborInput] = useState("");
  const [loadingLabors, setLoadingLabors] = useState<string[]>([]);
  const [unloadingLabors, setUnloadingLabors] = useState<string[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const saved = localStorage.getItem("sbco_vehicles");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const [rateVehicleType, setRateVehicleType] = useState<
    "Tractor" | "12 Wheel"
  >("Tractor");
  const [rates, setRates] = useState<{
    tractorLocalRate: string;
    tractorOutsideRate: string;
    tractorSafetyBatsRate: string;
    wheelLocalRate: string;
    wheelSafetyBatsRate: string;
  }>(() => {
    try {
      const saved = localStorage.getItem("sbco_rates");
      return saved
        ? JSON.parse(saved)
        : {
            tractorLocalRate: "",
            tractorOutsideRate: "",
            tractorSafetyBatsRate: "",
            wheelLocalRate: "",
            wheelSafetyBatsRate: "",
          };
    } catch {
      return {
        tractorLocalRate: "",
        tractorOutsideRate: "",
        tractorSafetyBatsRate: "",
        wheelLocalRate: "",
        wheelSafetyBatsRate: "",
      };
    }
  });
  const [draftRates, setDraftRates] = useState<typeof rates>(() => {
    try {
      const saved = localStorage.getItem("sbco_rates");
      return saved
        ? JSON.parse(saved)
        : {
            tractorLocalRate: "",
            tractorOutsideRate: "",
            tractorSafetyBatsRate: "",
            wheelLocalRate: "",
            wheelSafetyBatsRate: "",
          };
    } catch {
      return {
        tractorLocalRate: "",
        tractorOutsideRate: "",
        tractorSafetyBatsRate: "",
        wheelLocalRate: "",
        wheelSafetyBatsRate: "",
      };
    }
  });
  const saveRates = (r: typeof rates) => {
    setRates(r);
    setDraftRates(r);
    localStorage.setItem("sbco_rates", JSON.stringify(r));
  };

  const saveVehicles = (list: Vehicle[]) => {
    setVehicles(list);
    localStorage.setItem("sbco_vehicles", JSON.stringify(list));
  };

  const addLabor = () => {
    const name = laborInput.trim();
    if (!name || loadingLabors.includes(name)) return;
    setLoadingLabors((prev) => [...prev, name]);
    setUnloadingLabors((prev) => [...prev, name]);
    setLaborInput("");
  };

  const removeLabor = (name: string) => {
    setLoadingLabors((prev) => prev.filter((l) => l !== name));
  };

  const handleSave = () => {
    if (!vehicleNumber.trim()) {
      toast.error("Vehicle number is required");
      return;
    }
    if (editingId) {
      saveVehicles(
        vehicles.map((v) =>
          v.id === editingId
            ? {
                ...v,
                type: vehicleType,
                number: vehicleNumber.trim(),
                loadingLabors,
                unloadingLabors,
              }
            : v,
        ),
      );
      setEditingId(null);
    } else {
      const newVehicle: Vehicle = {
        id: Date.now().toString(),
        type: vehicleType,
        number: vehicleNumber.trim(),
        loadingLabors,
        unloadingLabors,
      };
      saveVehicles([newVehicle, ...vehicles]);
    }
    setVehicleNumber("");
    setLoadingLabors([]);
    setUnloadingLabors([]);
    setVehicleType("Tractor");
    toast.success(editingId ? "Vehicle updated!" : "Vehicle saved!");
  };

  const handleEdit = (v: Vehicle) => {
    setEditingId(v.id);
    setVehicleType(v.type);
    setVehicleNumber(v.number);
    setLoadingLabors([...v.loadingLabors]);
    setUnloadingLabors([...(v.unloadingLabors ?? [])]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    saveVehicles(vehicles.filter((v) => v.id !== id));
    toast.success("Vehicle removed");
  };

  return (
    <motion.div
      key="settings"
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 60, opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="min-h-screen bg-background flex flex-col"
      data-ocid="settings.page"
    >
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 py-5 flex items-center gap-3">
        <button
          type="button"
          data-ocid="settings.back.button"
          onClick={onBack}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold uppercase tracking-widest">
          Settings
        </h1>
      </header>

      {/* Tabs */}
      <div className="px-4 pt-4">
        <div className="flex bg-muted rounded-full p-1 gap-1">
          {(["vehicles", "rates", "backup"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              data-ocid={`settings.${tab}.tab`}
              onClick={() =>
                setActiveTab(tab as "vehicles" | "rates" | "backup")
              }
              className={`flex-1 py-2 rounded-full text-xs font-semibold capitalize transition-all ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "vehicles"
                ? "🚛 Vehicles"
                : tab === "rates"
                  ? "💰 Rates"
                  : "💾 Backup"}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 px-4 pt-4 pb-8 flex flex-col gap-5 overflow-y-auto">
        {activeTab === "vehicles" ? (
          <>
            {/* Add / Edit Form */}
            <div className="bg-card rounded-2xl shadow p-4 flex flex-col gap-4 border border-border">
              <h2 className="font-bold text-base text-foreground">
                🚛 {editingId ? "Edit Vehicle" : "Add New Vehicle"}
              </h2>

              {/* Vehicle Type */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Vehicle Type
                </p>
                <div className="flex gap-2">
                  {(["Tractor", "12 Wheel"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      data-ocid="settings.vehicle_type.toggle"
                      onClick={() => setVehicleType(t)}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                        vehicleType === t
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-foreground border-border hover:border-primary/50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vehicle Number */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Vehicle Number
                </p>
                <input
                  data-ocid="settings.vehicle_number.input"
                  type="text"
                  placeholder="e.g. WB 52 1234"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {/* Loading Labors */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Loading Labors
                </p>
                <div className="flex gap-2 mb-2">
                  <input
                    data-ocid="settings.labor.input"
                    type="text"
                    placeholder="Enter labor name"
                    value={laborInput}
                    onChange={(e) => setLaborInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addLabor()}
                    className="flex-1 px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <button
                    type="button"
                    data-ocid="settings.labor.add_button"
                    onClick={addLabor}
                    className="w-10 h-10 rounded-lg bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center hover:opacity-90 transition-opacity"
                  >
                    +
                  </button>
                </div>
                {loadingLabors.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {loadingLabors.map((name) => (
                      <span
                        key={name}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/15 text-primary rounded-full text-xs font-semibold"
                      >
                        {name}
                        <button
                          type="button"
                          data-ocid="settings.labor.delete_button"
                          onClick={() => removeLabor(name)}
                          className="ml-0.5 text-primary/70 hover:text-primary font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Unloading Labors (independent) */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Unloading Labors
                </p>
                {unloadingLabors.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {unloadingLabors.map((name) => (
                      <span
                        key={name}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold"
                      >
                        {name}
                        <button
                          type="button"
                          onClick={() =>
                            setUnloadingLabors((prev) =>
                              prev.filter((l) => l !== name),
                            )
                          }
                          className="ml-0.5 text-blue-500 hover:text-blue-800 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    No unloading labors added yet
                  </p>
                )}
              </div>

              {/* Save Button */}
              <button
                type="button"
                data-ocid="settings.vehicle.save_button"
                onClick={handleSave}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold uppercase tracking-wider text-sm hover:opacity-90 transition-opacity"
              >
                {editingId ? "Update Vehicle" : "Save Vehicle"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setVehicleNumber("");
                    setLoadingLabors([]);
                    setUnloadingLabors([]);
                    setVehicleType("Tractor");
                  }}
                  className="w-full py-2.5 rounded-xl border border-border text-muted-foreground text-sm hover:opacity-80 transition-opacity"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {/* Vehicle List */}
            {vehicles.length > 0 && (
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                  Saved Vehicles
                </h3>
                {vehicles.map((v) => (
                  <div
                    key={v.id}
                    data-ocid="settings.vehicle.card"
                    className="bg-card rounded-2xl shadow border border-border p-4 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-foreground">
                          {v.number}
                        </span>
                        <span className="px-2 py-0.5 bg-primary/15 text-primary rounded-full text-xs font-semibold">
                          {v.type}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          data-ocid="settings.vehicle.edit_button"
                          onClick={() => handleEdit(v)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          data-ocid="settings.vehicle.delete_button"
                          onClick={() => handleDelete(v.id)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    {v.loadingLabors.length > 0 && (
                      <>
                        <div>
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                            Loading
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {v.loadingLabors.map((n) => (
                              <span
                                key={n}
                                className="px-2 py-0.5 bg-primary/15 text-primary rounded-full text-xs font-semibold"
                              >
                                {n}
                              </span>
                            ))}
                          </div>
                        </div>
                        {(v.unloadingLabors ?? []).length > 0 && (
                          <div>
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                              Unloading
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {(v.unloadingLabors ?? []).map((n) => (
                                <span
                                  key={n}
                                  className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold"
                                >
                                  {n}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {vehicles.length === 0 && (
              <div
                data-ocid="settings.vehicles.empty_state"
                className="flex flex-col items-center justify-center py-12 gap-3 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-brand-mint-badge flex items-center justify-center">
                  <span className="text-3xl">🚛</span>
                </div>
                <p className="text-sm font-semibold text-muted-foreground">
                  No vehicles saved yet
                </p>
              </div>
            )}
          </>
        ) : activeTab === "rates" ? (
          <div data-ocid="settings.rates.panel" className="flex flex-col gap-4">
            {/* Vehicle type toggle */}
            <div className="flex gap-2 bg-brand-mint-badge rounded-xl p-1">
              {(["Tractor", "12 Wheel"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setRateVehicleType(t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${rateVehicleType === t ? "bg-brand-primary text-white shadow" : "text-brand-primary"}`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Rate inputs */}
            <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-3">
              {rateVehicleType === "Tractor" ? (
                <>
                  <div>
                    <label
                      htmlFor="rateField1"
                      className="text-xs font-semibold text-muted-foreground mb-1 block"
                    >
                      লোকাল পার হাজার ইট রেট
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder="Enter rate"
                      value={draftRates.tractorLocalRate}
                      onChange={(e) =>
                        setDraftRates((r) => ({
                          ...r,
                          tractorLocalRate: e.target.value,
                        }))
                      }
                      className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="rateField2"
                      className="text-xs font-semibold text-muted-foreground mb-1 block"
                    >
                      আউট সাইড পার হাজার ইট রেট
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder="Enter rate"
                      value={draftRates.tractorOutsideRate}
                      onChange={(e) =>
                        setDraftRates((r) => ({
                          ...r,
                          tractorOutsideRate: e.target.value,
                        }))
                      }
                      className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="rateField3"
                      className="text-xs font-semibold text-muted-foreground mb-1 block"
                    >
                      100 Safety Bats রেট
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder="Enter rate"
                      value={draftRates.tractorSafetyBatsRate}
                      onChange={(e) =>
                        setDraftRates((r) => ({
                          ...r,
                          tractorSafetyBatsRate: e.target.value,
                        }))
                      }
                      className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label
                      htmlFor="rateField4"
                      className="text-xs font-semibold text-muted-foreground mb-1 block"
                    >
                      পার হাজার ইট রেট
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder="Enter rate"
                      value={draftRates.wheelLocalRate}
                      onChange={(e) =>
                        setDraftRates((r) => ({
                          ...r,
                          wheelLocalRate: e.target.value,
                        }))
                      }
                      className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="rateField5"
                      className="text-xs font-semibold text-muted-foreground mb-1 block"
                    >
                      100 Safety Bats রেট
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder="Enter rate"
                      value={draftRates.wheelSafetyBatsRate}
                      onChange={(e) =>
                        setDraftRates((r) => ({
                          ...r,
                          wheelSafetyBatsRate: e.target.value,
                        }))
                      }
                      className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                </>
              )}
              <button
                type="button"
                data-ocid="settings.rates.save_button"
                onClick={() => {
                  saveRates(draftRates);
                  toast.success("Rates saved!");
                }}
                className="mt-1 w-full bg-brand-primary text-white rounded-xl py-2.5 text-sm font-bold shadow hover:opacity-90 transition-all"
              >
                রেট সেভ করুন
              </button>
            </div>

            {/* Summary */}
            {(rates.tractorLocalRate ||
              rates.tractorOutsideRate ||
              rates.tractorSafetyBatsRate ||
              rates.wheelLocalRate ||
              rates.wheelSafetyBatsRate) && (
              <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-3">
                <p className="text-xs font-bold text-brand-primary uppercase tracking-wide">
                  Saved Rates Summary
                </p>
                {(rates.tractorLocalRate ||
                  rates.tractorOutsideRate ||
                  rates.tractorSafetyBatsRate) && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-bold text-foreground">
                        🚜 Tractor
                      </p>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          title="Edit"
                          onClick={() => {
                            setDraftRates(rates);
                            setRateVehicleType("Tractor");
                          }}
                          className="p-1 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          type="button"
                          title="Delete"
                          onClick={() => {
                            if (confirm("Tractor রেট মুছে ফেলবেন?")) {
                              const updated = {
                                ...rates,
                                tractorLocalRate: "",
                                tractorOutsideRate: "",
                                tractorSafetyBatsRate: "",
                              };
                              saveRates(updated);
                            }
                          }}
                          className="p-1 rounded-lg bg-red-50 text-red-400 hover:bg-red-100"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    {rates.tractorLocalRate && (
                      <p className="text-xs text-muted-foreground">
                        লোকাল পার হাজার ইট:{" "}
                        <span className="font-semibold text-foreground">
                          {rates.tractorLocalRate}
                        </span>
                      </p>
                    )}
                    {rates.tractorOutsideRate && (
                      <p className="text-xs text-muted-foreground">
                        আউট সাইড পার হাজার ইট:{" "}
                        <span className="font-semibold text-foreground">
                          {rates.tractorOutsideRate}
                        </span>
                      </p>
                    )}
                    {rates.tractorSafetyBatsRate && (
                      <p className="text-xs text-muted-foreground">
                        100 Safety Bats:{" "}
                        <span className="font-semibold text-foreground">
                          {rates.tractorSafetyBatsRate}
                        </span>
                      </p>
                    )}
                  </div>
                )}
                {(rates.wheelLocalRate || rates.wheelSafetyBatsRate) && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-bold text-foreground">
                        🚛 12 Wheel
                      </p>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          title="Edit"
                          onClick={() => {
                            setDraftRates(rates);
                            setRateVehicleType("12 Wheel");
                          }}
                          className="p-1 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          type="button"
                          title="Delete"
                          onClick={() => {
                            if (confirm("12 Wheel রেট মুছে ফেলবেন?")) {
                              const updated = {
                                ...rates,
                                wheelLocalRate: "",
                                wheelSafetyBatsRate: "",
                              };
                              saveRates(updated);
                            }
                          }}
                          className="p-1 rounded-lg bg-red-50 text-red-400 hover:bg-red-100"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    {rates.wheelLocalRate && (
                      <p className="text-xs text-muted-foreground">
                        পার হাজার ইট:{" "}
                        <span className="font-semibold text-foreground">
                          {rates.wheelLocalRate}
                        </span>
                      </p>
                    )}
                    {rates.wheelSafetyBatsRate && (
                      <p className="text-xs text-muted-foreground">
                        100 Safety Bats:{" "}
                        <span className="font-semibold text-foreground">
                          {rates.wheelSafetyBatsRate}
                        </span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Backup Tab */
          <div data-ocid="backup.panel" className="flex flex-col gap-4">
            {/* Backup & Restore Card */}
            <div className="bg-card rounded-2xl shadow border border-border p-4 flex flex-col gap-4">
              <h2 className="font-bold text-base text-foreground">
                💾 ডেটা ব্যাকআপ ও পুনরুদ্ধার
              </h2>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-muted/50 rounded-xl">
                <Clock size={14} className="text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">শেষ ব্যাকআপ</p>
                  <p className="text-sm font-semibold text-foreground">
                    {lastBackupTime
                      ? new Date(lastBackupTime).toLocaleString("en-BD", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "কোনো ব্যাকআপ নেই"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                data-ocid="backup.export.button"
                onClick={() => {
                  const data: Record<string, any> = {};
                  for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i)!;
                    if (key === "sbco_autobackup") continue;
                    try {
                      data[key] = JSON.parse(localStorage.getItem(key)!);
                    } catch {
                      data[key] = localStorage.getItem(key);
                    }
                  }
                  const blob = new Blob(
                    [
                      JSON.stringify(
                        {
                          version: 1,
                          exportedAt: new Date().toISOString(),
                          data,
                        },
                        null,
                        2,
                      ),
                    ],
                    { type: "application/json" },
                  );
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `sbco-backup-${new Date().toISOString().slice(0, 10)}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                  const ts = new Date().toISOString();
                  localStorage.setItem("sbco_lastBackup", ts);
                  setLastBackupTime(ts);
                  toast.success("ব্যাকআপ সফলভাবে ডাউনলোড হয়েছে");
                }}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Download size={16} />
                ব্যাকআপ করুন
              </button>
              <div>
                <input
                  type="file"
                  accept=".json"
                  id="backup-restore-input"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      try {
                        const parsed = JSON.parse(ev.target?.result as string);
                        const importData = parsed.data || parsed;
                        for (const [key, value] of Object.entries(importData)) {
                          localStorage.setItem(
                            key,
                            typeof value === "string"
                              ? value
                              : JSON.stringify(value),
                          );
                        }
                        toast.success("ব্যাকআপ পুনরুদ্ধার হয়েছে! রিলোড হচ্ছে...");
                        setTimeout(() => window.location.reload(), 1500);
                      } catch {
                        toast.error("ব্যাকআপ ফাইল পড়তে ব্যর্থ হয়েছে");
                      }
                    };
                    reader.readAsText(file);
                    e.target.value = "";
                  }}
                />
                <button
                  type="button"
                  data-ocid="backup.import.button"
                  onClick={() =>
                    document.getElementById("backup-restore-input")?.click()
                  }
                  className="w-full py-3 rounded-xl border-2 border-primary text-primary font-bold text-sm hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                >
                  <Upload size={16} />
                  ব্যাকআপ পুনরুদ্ধার
                </button>
              </div>
            </div>

            {/* Recently Deleted */}
            <div className="bg-card rounded-2xl shadow border border-border p-4 flex flex-col gap-3">
              <h2 className="font-bold text-base text-foreground">
                🗑️ সম্প্রতি মুছে ফেলা
              </h2>
              <p className="text-xs text-muted-foreground">
                মুছে ফেলা আইটেম ৭ দিন পর্যন্ত এখানে থাকবে।
              </p>
              {trash.length === 0 ? (
                <div
                  data-ocid="trash.empty_state"
                  className="flex flex-col items-center justify-center py-8 gap-2 text-center"
                >
                  <span className="text-3xl">✅</span>
                  <p className="text-sm text-muted-foreground">
                    কোনো মুছে ফেলা আইটেম নেই
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {trash.map((item, idx) => {
                    const name =
                      item.item?.customerName ||
                      item.item?.number ||
                      item.item?.invoiceNumber ||
                      "অজানা";
                    const deletedAgo = (() => {
                      const diff =
                        Date.now() - new Date(item.deletedAt).getTime();
                      const days = Math.floor(diff / 86400000);
                      const hours = Math.floor(diff / 3600000);
                      if (days > 0) return `${days} দিন আগে`;
                      if (hours > 0) return `${hours} ঘণ্টা আগে`;
                      return "এইমাত্র";
                    })();
                    const typeLabel =
                      item.type === "order"
                        ? "অর্ডার"
                        : item.type === "delivery"
                          ? "ডেলিভারি"
                          : item.type === "completedDelivery"
                            ? "সম্পন্ন ডেলিভারি"
                            : "বন্ধ অর্ডার";
                    return (
                      <div
                        key={item.id}
                        data-ocid={`trash.item.${idx + 1}`}
                        className="flex items-center gap-2 p-3 bg-muted/40 rounded-xl border border-border"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] px-1.5 py-0.5 bg-primary/15 text-primary rounded-full font-semibold">
                              {typeLabel}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {deletedAgo}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            type="button"
                            data-ocid={`trash.restore_button.${idx + 1}`}
                            onClick={() => {
                              setTrash((prev) =>
                                prev.filter((t) => t.id !== item.id),
                              );
                              toast.success(`${name} পুনরুদ্ধার করা হয়েছে`);
                            }}
                            className="px-2 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                          >
                            পুনরুদ্ধার
                          </button>
                          <button
                            type="button"
                            data-ocid={`trash.delete_button.${idx + 1}`}
                            onClick={() => {
                              if (
                                window.confirm(`"${name}" স্থায়ীভাবে মুছে দেবেন?`)
                              ) {
                                setTrash((prev) =>
                                  prev.filter((t) => t.id !== item.id),
                                );
                                toast.success("স্থায়ীভাবে মুছে ফেলা হয়েছে");
                              }
                            }}
                            className="p-1.5 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </motion.div>
  );
}

function ReportsPage({
  onBack,
  completedDeliveries,
}: {
  onBack: () => void;
  completedDeliveries: Order[];
}) {
  const [activeTab, setActiveTab] = useState<"daily" | "weekly">("daily");
  return (
    <motion.div
      key="reports"
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 60, opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="min-h-screen bg-background flex flex-col"
    >
      <header className="no-print bg-primary text-primary-foreground px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button
          type="button"
          data-ocid="reports.back.button"
          onClick={onBack}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold uppercase tracking-widest">Reports</h1>
      </header>
      <div className="no-print flex gap-2 px-4 pt-4 pb-2">
        <button
          type="button"
          data-ocid="reports.daily.tab"
          onClick={() => setActiveTab("daily")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${activeTab === "daily" ? "bg-primary text-primary-foreground" : "bg-brand-mint-badge text-primary"}`}
        >
          📋 Daily Report
        </button>
        <button
          type="button"
          data-ocid="reports.weekly.tab"
          onClick={() => setActiveTab("weekly")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${activeTab === "weekly" ? "bg-primary text-primary-foreground" : "bg-brand-mint-badge text-primary"}`}
        >
          📅 Weekly Report
        </button>
      </div>
      <div className="flex-1">
        {activeTab === "daily" ? (
          <DailyLabourReportPage
            onBack={onBack}
            completedDeliveries={completedDeliveries}
            embedded
          />
        ) : (
          <WeeklyLabourReportPage
            onBack={onBack}
            completedDeliveries={completedDeliveries}
            embedded
          />
        )}
      </div>
    </motion.div>
  );
}

function PermissionDialog({
  open,
  onClose,
  onConfirm,
  title,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent data-ocid="permission.dialog" className="max-w-xs mx-4">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {title || "ডিলিট করুন?"}
          </DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <p className="text-sm text-muted-foreground">
            আপনি কি সত্যিই এটি ডিলিট করতে চান?
          </p>
        </div>
        <DialogFooter className="flex gap-2">
          <button
            type="button"
            data-ocid="permission.cancel_button"
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
          >
            বাতিল
          </button>
          <button
            type="button"
            data-ocid="permission.confirm_button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-2 rounded-lg bg-destructive text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            হ্যাঁ, ডিলিট করুন
          </button>
        </DialogFooter>
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

// ─── Pending Order Detail Page ────────────────────────────────────────────────

function PendingOrderDetailPage({
  order,
  onBack,
  onSave,
}: {
  order: Order;
  onBack: () => void;
  onSave: (updated: Order) => void;
}) {
  const [selectedBricks, setSelectedBricks] = useState<Set<BrickType>>(
    new Set(),
  );
  const [deliveryQtys, setDeliveryQtys] = useState<
    Partial<Record<BrickType, number>>
  >({});

  const [pendingDate, setPendingDate] = useState(getTodayISO());
  const dueBricks = order.totalBricks;

  const totalDeliveryBricks = BRICK_TYPES.reduce((sum, type) => {
    if (type === "Bats") return sum;
    if (selectedBricks.has(type)) return sum + (deliveryQtys[type] || 0);
    return sum;
  }, 0);

  const toggleBrick = (type: BrickType) => {
    setSelectedBricks((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const setQty = (type: BrickType, val: string) => {
    setDeliveryQtys((prev) => ({ ...prev, [type]: Number(val) || 0 }));
  };

  const handleSave = () => {
    if (totalDeliveryBricks <= 0) {
      toast.error("কমপক্ষে একটি ইট টাইপ ও পরিমাণ নির্বাচন করুন।");
      return;
    }
    // Build brick list using only user-selected quantities
    const selectedBrickList = BRICK_TYPES.filter(
      (t) =>
        t !== "Bats" && selectedBricks.has(t) && (deliveryQtys[t] || 0) > 0,
    ).map((t) => ({ type: t, quantity: deliveryQtys[t] || 0 }));

    const pendingEntry: Order = {
      ...order,
      bricks: selectedBrickList,
      totalBricks: totalDeliveryBricks,
      orderDate: pendingDate,
    };
    onSave(pendingEntry);
    toast.success("পেন্ডিং ডেলিভারিতে যোগ হয়েছে!");
  };

  return (
    <motion.div
      key="pending-order"
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
          data-ocid="pending_order.back.button"
          onClick={onBack}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold uppercase tracking-widest">
          PENDING ORDER
        </h1>
        <span className="ml-auto text-[10px] font-extrabold uppercase tracking-wider bg-destructive px-3 py-1 rounded-full">
          PENDING
        </span>
      </header>

      <div className="flex-1 overflow-y-auto pb-8">
        {/* Pending Date Row */}
        <div className="mx-4 mt-4 bg-card rounded-xl shadow-card px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays size={18} className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              PENDING DATE
            </span>
          </div>
          <input
            type="date"
            value={pendingDate}
            onChange={(e) => setPendingDate(e.target.value)}
            className="text-sm font-extrabold text-foreground bg-transparent border border-border rounded-lg px-2 py-1"
          />
        </div>

        {/* Customer Information */}
        <div className="mx-4 mt-4">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2 px-1">
            CUSTOMER INFORMATION
          </p>
          <div className="bg-card rounded-xl shadow-card px-4 py-4 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Name
                </Label>
                <div className="mt-1 h-10 rounded-lg border border-border bg-muted/40 px-3 flex items-center">
                  <span className="text-sm font-semibold text-foreground truncate">
                    {order.customerName}
                  </span>
                </div>
              </div>
              <div>
                <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Address
                </Label>
                <div className="mt-1 h-10 rounded-lg border border-border bg-muted/40 px-3 flex items-center">
                  <span className="text-sm font-semibold text-foreground truncate">
                    {order.address || "—"}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Phone
                </Label>
                <div className="mt-1 h-10 rounded-lg border border-border bg-muted/40 px-3 flex items-center">
                  <span className="text-sm font-semibold text-foreground truncate">
                    {order.phoneNumber}
                  </span>
                </div>
              </div>
              <div>
                <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Invoice
                </Label>
                <div className="mt-1 h-10 rounded-lg border border-border bg-muted/40 px-3 flex items-center">
                  <span className="text-sm font-semibold text-foreground truncate">
                    {order.invoiceNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Due Summary Box */}
            <div
              className="mt-1 rounded-2xl px-4 pt-3 pb-3"
              style={{
                background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
                minHeight: "110px",
                maxHeight: "130px",
              }}
            >
              {/* Top row: Due Bricks | Due Amount */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/80 mb-0.5">
                    Due Bricks
                  </p>
                  <p className="text-[28px] font-extrabold text-white leading-none">
                    {dueBricks.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/80 mb-0.5">
                    Due Amount
                  </p>
                  <span className="inline-block bg-white rounded-full px-3 py-1 text-base font-extrabold text-red-600 leading-tight shadow-sm">
                    ₹{order.dueAmount.toLocaleString()}
                  </span>
                </div>
              </div>
              {/* Per-brick breakdown */}
              {order.bricks.filter((b) => b.type !== "Bats").length > 0 && (
                <div className="mt-2 pt-2 border-t border-white/30 flex flex-row flex-wrap gap-x-4 gap-y-0.5">
                  {order.bricks
                    .filter((b) => b.type !== "Bats")
                    .map((b) => (
                      <span
                        key={b.type}
                        className="text-[12px] font-semibold text-white"
                      >
                        {b.type}:{" "}
                        <span className="font-extrabold">
                          {b.quantity.toLocaleString()}
                        </span>
                      </span>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Brick Types — delivery selection */}
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
                    data-ocid={`pending_order.brick.${type.toLowerCase().replace(/ /g, "_")}.toggle`}
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
                            {isBats ? "Safety" : "Delivery Qty"}
                          </Label>
                          <Input
                            data-ocid={`pending_order.brick.${type.toLowerCase().replace(/ /g, "_")}.input`}
                            type="number"
                            min="0"
                            placeholder="0"
                            className="mt-0.5 h-8 rounded-md border-border bg-background text-sm"
                            value={deliveryQtys[type] || ""}
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

          {/* Total Bricks summary */}
          <div className="mt-3 bg-primary/10 border border-primary/30 rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wide text-primary">
              TOTAL BRICKS
            </span>
            <span className="text-xl font-extrabold text-primary">
              {totalDeliveryBricks.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Save Button */}
        <div className="mx-4 mt-6">
          <button
            type="button"
            data-ocid="pending_order.save.submit_button"
            onClick={handleSave}
            className="w-full py-4 rounded-full bg-primary text-primary-foreground text-base font-extrabold uppercase tracking-widest shadow-card hover:opacity-90 active:scale-95 transition-all"
          >
            PENDING ডেলিভারি যোগ করুন
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Order History Modal ──────────────────────────────────────────────────────

function OrderHistoryModal({
  open,
  order,
  completedDeliveries,
  onClose,
}: {
  open: boolean;
  order: Order | null;
  completedDeliveries: Order[];
  onClose: () => void;
}) {
  if (!open || !order) return null;

  const deliveries = completedDeliveries.filter((d) => d.id === order.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-extrabold text-gray-800 uppercase tracking-wide">
              Order History
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">{order.customerName}</p>
          </div>
          <button
            type="button"
            data-ocid="order_history.close_button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X size={16} className="text-gray-600" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Delivery History */}
          <div className="rounded-xl overflow-hidden border border-green-200">
            <div className="bg-green-600 px-4 py-2.5 flex items-center gap-2">
              <Truck size={15} className="text-white" />
              <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                Delivery History
              </span>
            </div>
            {deliveries.length === 0 ? (
              <div className="px-4 py-5 text-center text-xs text-gray-400">
                কোনো ডেলিভারি নেই
              </div>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-green-50 text-green-700 font-bold">
                    <th className="px-3 py-2 text-left">DATE</th>
                    <th className="px-3 py-2 text-left">BRICK TYPE</th>
                    <th className="px-3 py-2 text-right">QTY</th>
                    <th className="px-3 py-2 text-left">VEHICLE</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map((d, i) => (
                    <tr
                      key={`${d.id}-del-${i}`}
                      className={i % 2 === 0 ? "bg-white" : "bg-green-50/40"}
                    >
                      <td className="px-3 py-2 text-gray-600">{d.orderDate}</td>
                      <td className="px-3 py-2 text-gray-700">
                        {d.bricks.map((b) => b.type).join(", ")}
                      </td>
                      <td className="px-3 py-2 text-right font-semibold text-gray-800">
                        {d.totalBricks.toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-gray-600">
                        {d.completionData?.vehicleNumber || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Payment History */}
          <div className="rounded-xl overflow-hidden border border-red-200">
            <div className="bg-red-500 px-4 py-2.5 flex items-center gap-2">
              <CreditCard size={15} className="text-white" />
              <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                Payment History
              </span>
            </div>
            {!order.paymentHistory || order.paymentHistory.length === 0 ? (
              <div className="px-4 py-5 text-center text-xs text-gray-400">
                কোনো পেমেন্ট নেই
              </div>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-red-50 text-red-700 font-bold">
                    <th className="px-3 py-2 text-left">DATE</th>
                    <th className="px-3 py-2 text-left">TIME</th>
                    <th className="px-3 py-2 text-right">AMOUNT PAID</th>
                  </tr>
                </thead>
                <tbody>
                  {order.paymentHistory.map((p, i) => (
                    <tr
                      key={`${p.date}-${p.time}-${i}`}
                      className={i % 2 === 0 ? "bg-white" : "bg-red-50/40"}
                    >
                      <td className="px-3 py-2 text-gray-600">{p.date}</td>
                      <td className="px-3 py-2 text-gray-600">{p.time}</td>
                      <td className="px-3 py-2 text-right font-bold text-red-600">
                        ₹{p.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Total Orders Page ────────────────────────────────────────────────────────

function TotalOrdersPage({
  orders,
  onBack,
  onUpdateOrder,
  onDeleteOrder,
  onViewPending: _onViewPending,
  onMarkPending,
  completedDeliveries,
}: {
  orders: Order[];
  onBack: () => void;
  onUpdateOrder: (updatedOrder: Order) => void;
  onDeleteOrder: (orderId: string) => void;
  onViewPending: (order: Order) => void;
  onMarkPending: (order: Order) => void;
  completedDeliveries: Order[];
}) {
  const [search, setSearch] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [activeFrom, setActiveFrom] = useState("");
  const [activeTo, setActiveTo] = useState("");
  const [historyOrder, setHistoryOrder] = useState<Order | null>(null);
  const [paymentOrder, setPaymentOrder] = useState<Order | null>(null);
  const [editOrder, setEditOrder] = useState<Order | null>(null);

  const activeOrders = orders.filter(
    (o) => !(o.dueAmount === 0 && (o.deliveredBricks || 0) >= o.totalBricks),
  );
  const filtered = activeOrders.filter((o) => {
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
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-GB").replace(/\//g, "/");
    const timeStr = now.toTimeString().slice(0, 5);
    onUpdateOrder({
      ...order,
      paidAmount: newPaid,
      dueAmount: newDue < 0 ? 0 : newDue,
      paymentHistory: [
        ...(order.paymentHistory || []),
        { date: dateStr, time: timeStr, amount },
      ],
    });
  };

  const [_permTarget, setPermTarget] = useState<Order | null>(null);
  const handleDelete = (order: Order) => {
    setPermTarget(order);
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
          <AnimatePresence>
            {filtered.map((order, i) => (
              <motion.div
                key={order.id}
                data-ocid={`total_orders.item.${i + 1}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.04, duration: 0.22 }}
                className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
              >
                <div className="bg-brand-mint-badge px-4 py-3 flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold text-foreground leading-tight truncate">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {order.address || "—"} · INV#{order.invoiceNumber}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      data-ocid={`total_orders.item.${i + 1}.history.button`}
                      onClick={() => setHistoryOrder(order)}
                      className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                    >
                      <Clock size={14} className="text-primary" />
                    </button>
                    <button
                      type="button"
                      data-ocid={`total_orders.item.${i + 1}.edit_button`}
                      onClick={() => {
                        setEditOrder(order);
                      }}
                      className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors"
                    >
                      <Pencil size={13} className="text-blue-700" />
                    </button>
                    <button
                      type="button"
                      data-ocid={`total_orders.item.${i + 1}.delete_button`}
                      onClick={() => handleDelete(order)}
                      className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors"
                    >
                      <Trash2 size={13} className="text-red-600" />
                    </button>
                    <button
                      type="button"
                      data-ocid={`total_orders.item.${i + 1}.pending_button`}
                      onClick={() => onMarkPending(order)}
                      title="পেন্ডিং ডেলিভারিতে যোগ করুন"
                      className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
                    >
                      <Truck size={13} className="text-white" />
                    </button>
                  </div>
                </div>
                <div className="px-4 py-2.5 space-y-1.5">
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    <span>📅 {order.orderDate}</span>
                    {order.phoneNumber && (
                      <a
                        href={`tel:${order.phoneNumber}`}
                        className="flex items-center gap-1 text-green-600 font-semibold hover:underline"
                      >
                        <Phone size={12} />
                        {order.phoneNumber}
                      </a>
                    )}
                    <span
                      className={`font-semibold ${order.locationType === "Local" ? "text-green-600" : "text-blue-600"}`}
                    >
                      {order.locationType}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {order.bricks.map((b, j) => (
                      <span
                        key={`${b.type}-${j}`}
                        className="bg-brand-mint-badge text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      >
                        {b.type}: {(b.quantity || 0).toLocaleString()}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="h-px bg-border" />
                <div className="grid grid-cols-4 gap-1 px-4 py-2.5">
                  {(
                    [
                      ["BRICKS", order.totalBricks.toLocaleString()],
                      ["TOTAL", `₹${order.totalAmount.toLocaleString()}`],
                      ["PAID", `₹${order.paidAmount.toLocaleString()}`],
                      ["DUE", `₹${order.dueAmount.toLocaleString()}`],
                    ] as [string, string][]
                  ).map(([label, val]) => (
                    <div key={label} className="text-center">
                      <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-wider">
                        {label}
                      </p>
                      <p
                        className={`text-xs font-extrabold mt-0.5 ${label === "DUE" && order.dueAmount > 0 ? "text-red-500" : "text-foreground"}`}
                      >
                        {val}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="h-px bg-border" />
                <div className="px-4 py-2.5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      Bricks Due
                    </p>
                    <p className="text-sm font-extrabold text-foreground">
                      {Math.max(
                        0,
                        order.totalBricks - (order.deliveredBricks || 0),
                      ).toLocaleString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    data-ocid={`total_orders.item.${i + 1}.payment.button`}
                    onClick={() => setPaymentOrder(order)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
                  >
                    <CreditCard size={13} />
                    Add Payment
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </main>

      {/* Add Payment Dialog */}
      <AddPaymentDialog
        open={paymentOrder !== null}
        order={paymentOrder}
        onClose={() => setPaymentOrder(null)}
        onConfirm={handleAddPayment}
      />
      <OrderHistoryModal
        open={historyOrder !== null}
        order={historyOrder}
        completedDeliveries={completedDeliveries}
        onClose={() => setHistoryOrder(null)}
      />
      <EditOrderDialog
        order={editOrder}
        onClose={() => setEditOrder(null)}
        onSave={(updated) => {
          onUpdateOrder(updated);
          setEditOrder(null);
        }}
      />
      <PermissionDialog
        open={_permTarget !== null}
        onClose={() => setPermTarget(null)}
        onConfirm={() => {
          if (_permTarget) {
            onDeleteOrder(_permTarget.id);
            toast.success(`Order for ${_permTarget.customerName} deleted`);
            setPermTarget(null);
          }
        }}
      />
    </motion.div>
  );
}

// ─── PendingDeliveryPage ──────────────────────────────────────────────────────

function PendingDeliveryPage({
  orders,
  onBack,
  onDelete,
  onCompleteDelivery,
  onEditDelivery,
}: {
  orders: Order[];
  onBack: () => void;
  onDelete: (orderId: string) => void;
  onCompleteDelivery: (order: Order) => void;
  onEditDelivery: (order: Order) => void;
}) {
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const printListRef = useRef<HTMLElement>(null);
  const sorted = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 1000);
  };

  const getBrickInfo = (order: Order) => {
    if (!order.bricks || order.bricks.length === 0) return "—";
    return order.bricks
      .map((b) => {
        const qty = b.type === "Bats" ? (b.safety ?? 0) : b.quantity;
        return `${b.type} - ${qty.toLocaleString()}`;
      })
      .join(", ");
  };

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-list { padding: 0 !important; }
          body { background: white !important; overflow: visible !important; }
          * { overflow: visible !important; max-height: none !important; }
        }
      `}</style>
      <motion.div
        key="pending-delivery"
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 60, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="min-h-screen bg-green-50 flex flex-col"
      >
        {/* Header */}
        <header className="no-print bg-white px-4 pt-5 pb-4 shadow-sm border-b border-green-100 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              data-ocid="pending_delivery.nav.back.button"
              onClick={onBack}
              className="p-2 rounded-xl bg-green-50 hover:bg-green-100 transition-colors text-green-700 shrink-0"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                Pending List
              </h1>
              <p className="text-sm text-green-600 font-medium mt-0.5">
                {sorted.length} Pending{" "}
                {sorted.length === 1 ? "Delivery" : "Deliveries"}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                data-ocid="pending_delivery.print.button"
                onClick={handlePrint}
                className="no-print px-3 py-1.5 rounded-lg bg-green-600 border border-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-colors"
              >
                🖨 Print
              </button>
            </div>
          </div>
        </header>

        <main
          ref={printListRef}
          className="flex-1 p-4 flex flex-col gap-3 print-list"
        >
          {sorted.length === 0 ? (
            <div
              data-ocid="pending_delivery.empty_state"
              className="flex-1 flex flex-col items-center justify-center gap-4 py-20"
            >
              <div className="w-20 h-20 rounded-2xl bg-green-100 flex items-center justify-center">
                <Truck size={36} className="text-green-600" />
              </div>
              <p className="text-base font-bold text-gray-800 uppercase tracking-wide">
                No Pending Deliveries
              </p>
              <p className="text-sm text-gray-500 text-center">
                Save a pending order to see it here.
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {sorted.map((order, idx) => (
                <motion.div
                  key={order.id}
                  data-ocid={`pending_delivery.item.${idx + 1}`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: idx * 0.04, duration: 0.22 }}
                  className="bg-white rounded-2xl shadow-md border border-green-100 overflow-hidden"
                >
                  {/* Card Content */}
                  <div className="px-4 pt-4 pb-2 relative">
                    {/* Local Badge */}
                    {order.locationType === "Local" && (
                      <span className="absolute top-4 right-4 bg-green-100 border border-green-300 text-green-700 text-[11px] font-bold px-3 py-1 rounded-full">
                        Local
                      </span>
                    )}

                    {/* Row 1: Name | Location | Date */}
                    <div className="flex flex-wrap items-center gap-2 mb-2 pr-16">
                      <span className="text-[15px] font-extrabold text-gray-900 truncate max-w-[130px]">
                        {order.customerName}
                      </span>
                      {order.address && (
                        <span className="flex items-center gap-0.5 text-[13px] text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-400"
                            aria-label="Location"
                            role="img"
                          >
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          <span className="truncate max-w-[90px]">
                            {order.address}
                          </span>
                        </span>
                      )}
                      <span className="flex items-center gap-0.5 text-[13px] text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-gray-400"
                          aria-label="Date"
                          role="img"
                        >
                          <rect
                            width="18"
                            height="18"
                            x="3"
                            y="4"
                            rx="2"
                            ry="2"
                          />
                          <line x1="16" x2="16" y1="2" y2="6" />
                          <line x1="8" x2="8" y1="2" y2="6" />
                          <line x1="3" x2="21" y1="10" y2="10" />
                        </svg>
                        {order.orderDate}
                      </span>
                    </div>

                    {/* Row 2: Phone | Bricks | INV# | Amount */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      <a
                        href={`tel:${order.phoneNumber}`}
                        data-ocid={`pending_delivery.call.button.${idx + 1}`}
                        className="flex items-center gap-1 text-green-700 font-semibold text-[13px] hover:underline"
                      >
                        <Phone size={13} className="text-green-600" />
                        {order.phoneNumber}
                      </a>
                      <span className="flex items-center gap-1 text-[13px] text-gray-600">
                        <Layers size={13} className="text-gray-400" />
                        <span className="truncate max-w-[140px]">
                          {getBrickInfo(order)}
                        </span>
                      </span>
                      {order.invoiceNumber && (
                        <span className="flex items-center gap-1.5">
                          <span className="bg-indigo-100 text-indigo-700 text-[11px] font-bold px-2 py-0.5 rounded-md">
                            INV#
                          </span>
                          <span className="text-[13px] font-semibold text-gray-700">
                            {order.invoiceNumber}
                          </span>
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[13px] font-bold text-gray-900">
                        <Wallet size={13} className="text-gray-400" />
                        {order.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="mx-4 border-t border-gray-100 mt-3" />

                  {/* Action Buttons */}
                  <div className="no-print px-3 py-3 flex gap-2">
                    <button
                      type="button"
                      data-ocid={`pending_delivery.edit_button.${idx + 1}`}
                      onClick={() => onEditDelivery(order)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-green-100 text-green-700 font-bold text-[13px] hover:bg-green-200 transition-colors"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                    <button
                      type="button"
                      data-ocid={`pending_delivery.delete_button.${idx + 1}`}
                      onClick={() => setDeleteTarget(order)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-red-50 text-red-500 font-bold text-[13px] hover:bg-red-100 transition-colors border border-red-100"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                    <button
                      type="button"
                      data-ocid={`pending_delivery.mark_delivered_button.${idx + 1}`}
                      onClick={() => onCompleteDelivery(order)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-green-600 text-white font-bold text-[13px] hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle size={14} />
                      Complete
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </main>

        <PermissionDialog
          open={deleteTarget !== null}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            if (deleteTarget) {
              onDelete(deleteTarget.id);
              setDeleteTarget(null);
            }
          }}
        />
      </motion.div>
    </>
  );
}

interface CompleteDeliveryData {
  deliveryDate?: string;
  vehicleType: "Tractor" | "12 Wheel" | null;
  vehicleNumber: string | null;
  loadingLabours: string[];
  unloadingLabours: string[];
  paymentStatus: "Not Paid" | "Paid Money";
  rate: number;
  totalAmount: number;
  loadingShare: number;
  unloadingShare: number;
  perLoadingLabour: number;
  perUnloadingLabour: number;
}

function DirectDeliveryPage({
  onBack,
  onSaveComplete,
}: {
  onBack: () => void;
  onSaveComplete: (delivery: Order) => void;
}) {
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(getTodayISO());

  const [selectedBricks, setSelectedBricks] = useState<Set<BrickType>>(
    new Set(),
  );
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const [vehicleType, setVehicleType] = useState<"Tractor" | "12 Wheel" | null>(
    null,
  );
  const [vehicleNumber, setVehicleNumber] = useState<string | null>(null);
  const [loadingLabours, setLoadingLabours] = useState<string[]>([]);
  const [unloadingLabours, setUnloadingLabours] = useState<string[]>([]);
  const [customLoadingInput, setCustomLoadingInput] = useState("");
  const [customUnloadingInput, setCustomUnloadingInput] = useState("");

  const vehicles: Vehicle[] = (() => {
    try {
      const saved = localStorage.getItem("sbco_vehicles");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  })();

  const rates: {
    tractorLocalRate: number;
    tractorOutsideRate: number;
    tractorSafetyBatsRate: number;
    wheelLocalRate: number;
    wheelSafetyBatsRate: number;
  } = (() => {
    try {
      const saved = localStorage.getItem("sbco_rates");
      return saved
        ? JSON.parse(saved)
        : {
            tractorLocalRate: 0,
            tractorOutsideRate: 0,
            tractorSafetyBatsRate: 0,
            wheelLocalRate: 0,
            wheelSafetyBatsRate: 0,
          };
    } catch {
      return {
        tractorLocalRate: 0,
        tractorOutsideRate: 0,
        tractorSafetyBatsRate: 0,
        wheelLocalRate: 0,
        wheelSafetyBatsRate: 0,
      };
    }
  })();

  const toggleBrick = (type: BrickType) => {
    setSelectedBricks((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
        if (!quantities[type]) {
          setQuantities((q) => ({ ...q, [type]: 0 }));
        }
      }
      return next;
    });
  };

  const adjustQty = (type: BrickType, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [type]: Math.max(0, (prev[type] || 0) + delta),
    }));
  };

  const totalBricks = BRICK_TYPES.reduce((sum, type) => {
    if (type === "Bats" || !selectedBricks.has(type)) return sum;
    return sum + (quantities[type] || 0);
  }, 0);

  const computedRate = (() => {
    if (!vehicleType) return 0;
    if (vehicleType === "Tractor") return Number(rates.tractorLocalRate) || 0;
    return Number(rates.wheelLocalRate) || 0;
  })();

  const totalAmount = (totalBricks / 1000) * computedRate;
  const loadingShare = totalAmount / 2;
  const unloadingShare = totalAmount / 2;
  const perLoadingLabour =
    loadingLabours.length > 0 ? loadingShare / loadingLabours.length : 0;
  const perUnloadingLabour =
    unloadingLabours.length > 0 ? unloadingShare / unloadingLabours.length : 0;

  const handleVehicleTypeSelect = (vt: "Tractor" | "12 Wheel") => {
    setVehicleType((prev) => (prev === vt ? null : vt));
    setVehicleNumber(null);
    setLoadingLabours([]);
    setUnloadingLabours([]);
  };

  const handleVehicleNumberSelect = (vNum: string) => {
    if (vehicleNumber === vNum) {
      setVehicleNumber(null);
      return;
    }
    setVehicleNumber(vNum);
    const found = vehicles.find((v) => v.number === vNum);
    if (found) {
      setLoadingLabours(found.loadingLabors || []);
      setUnloadingLabours(found.unloadingLabors || []);
    }
  };

  const handleSave = () => {
    if (!customerName.trim()) {
      toast.error("Customer Name is required");
      return;
    }
    const bricks: BrickSelection[] = BRICK_TYPES.filter((t) =>
      selectedBricks.has(t),
    ).map((t) => ({
      type: t,
      quantity: t === "Bats" ? 0 : quantities[t] || 0,
      safety: t === "Bats" ? quantities[t] || 0 : undefined,
    }));

    const newOrder: Order = {
      id: crypto.randomUUID(),
      orderDate: deliveryDate,
      customerName: customerName.trim(),
      address: address.trim(),
      phoneNumber: phoneNumber.trim(),
      invoiceNumber: invoiceNumber.trim(),
      approxDeliveryDate: deliveryDate,
      bricks,
      totalBricks,
      totalAmount: 0,
      paidAmount: 0,
      dueAmount: 0,
      locationType: "Local",
      createdAt: new Date(),
      completionData: {
        vehicleType,
        vehicleNumber,
        loadingLabours,
        unloadingLabours,
        paymentStatus: "Not Paid",
        rate: computedRate,
        totalAmount,
        loadingShare,
        unloadingShare,
        perLoadingLabour,
        perUnloadingLabour,
      },
    };

    onSaveComplete(newOrder);
    toast.success("Direct Delivery saved!");

    // Reset form
    setCustomerName("");
    setAddress("");
    setPhoneNumber("");
    setInvoiceNumber("");
    setDeliveryDate(getTodayISO());
    setSelectedBricks(new Set());
    setQuantities({});
    setVehicleType(null);
    setVehicleNumber(null);
    setLoadingLabours([]);
    setUnloadingLabours([]);
  };

  return (
    <motion.div
      key="direct-delivery-page"
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 60, opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="min-h-screen bg-green-50 flex flex-col pb-24"
    >
      {/* Header */}
      <header className="bg-white px-4 pt-3 pb-2 shadow-sm border-b border-green-100 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            data-ocid="direct_delivery.back.button"
            onClick={onBack}
            className="p-2 rounded-xl bg-green-50 hover:bg-green-100 transition-colors text-green-700 shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900 leading-tight">
              Direct Delivery
            </h1>
            <p className="text-sm text-green-600 font-medium mt-0.5">
              Add to Completed Directly
            </p>
          </div>
          <button
            type="button"
            data-ocid="direct_delivery.save.button"
            onClick={handleSave}
            className="p-2 rounded-full bg-green-600 hover:bg-green-700 transition-colors text-white shrink-0"
          >
            <CheckCircle size={22} />
          </button>
        </div>
      </header>

      <main className="flex-1 p-3 flex flex-col gap-3">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-green-100 p-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-700"
                aria-label="Customer"
                role="img"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Basic Information
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                Customer Name
              </p>
              <input
                data-ocid="direct_delivery.customer_name.input"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Name..."
                className="border border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50"
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                Address
              </p>
              <input
                data-ocid="direct_delivery.address.input"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address..."
                className="border border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50"
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                Phone Number
              </p>
              <input
                data-ocid="direct_delivery.phone.input"
                type="text"
                inputMode="numeric"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone..."
                className="border border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50"
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                Invoice Number
              </p>
              <input
                data-ocid="direct_delivery.invoice.input"
                type="text"
                inputMode="numeric"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="INV#..."
                className="border border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50"
              />
            </div>
            <div className="flex flex-col gap-1 col-span-2">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                Delivery Date
              </p>
              <input
                data-ocid="direct_delivery.date.input"
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full border border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50"
              />
            </div>
          </div>
        </div>

        {/* Brick Types */}
        <div className="bg-white rounded-xl shadow-sm border border-green-100 p-3">
          <div className="flex items-center gap-2 mb-3">
            <Layers size={16} className="text-green-700" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Brick Types
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {BRICK_TYPES.map((type) => {
              const isSelected = selectedBricks.has(type);
              const isBats = type === "Bats";
              return (
                <div key={type} className="flex flex-col">
                  <button
                    type="button"
                    data-ocid={`direct_delivery.brick.${type.toLowerCase().replace(/ /g, "_")}.toggle`}
                    onClick={() => toggleBrick(type)}
                    className={[
                      "w-full rounded-xl px-3 py-2.5 text-sm font-bold transition-all duration-150 select-none border",
                      isSelected
                        ? "bg-green-600 text-white border-green-600 shadow-sm"
                        : "bg-green-50 text-gray-700 border-green-200 hover:border-green-400",
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
                        <div className="mt-1.5 bg-green-50 rounded-lg border border-green-200 px-2 py-1.5">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-green-700 mb-1.5">
                            {isBats ? "Safety" : "Quantity"}
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => adjustQty(type, -100)}
                              className="w-7 h-7 rounded-full bg-green-600 text-white font-bold text-base flex items-center justify-center hover:bg-green-700 transition-colors shrink-0"
                            >
                              –
                            </button>
                            <span className="flex-1 text-center font-bold text-gray-900 text-sm">
                              {(quantities[type] || 0).toLocaleString()}
                            </span>
                            <button
                              type="button"
                              onClick={() => adjustQty(type, 100)}
                              className="w-7 h-7 rounded-full bg-green-600 text-white font-bold text-base flex items-center justify-center hover:bg-green-700 transition-colors shrink-0"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
          <div className="mt-3 bg-green-600/10 border border-green-300 rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wide text-green-700">
              TOTAL BRICKS
            </span>
            <span className="text-xl font-extrabold text-green-700">
              {totalBricks.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Vehicle Type */}
        <div className="bg-white rounded-xl shadow-sm border border-green-100 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Truck size={16} className="text-green-700" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Vehicle Type
            </span>
          </div>
          <div className="flex gap-2">
            {(["Tractor", "12 Wheel"] as const).map((vt) => (
              <button
                key={vt}
                type="button"
                data-ocid={`direct_delivery.vehicle_type.${vt.toLowerCase().replace(/ /g, "_")}.toggle`}
                onClick={() => handleVehicleTypeSelect(vt)}
                className={`flex-1 py-2.5 rounded-full font-bold text-sm transition-colors ${vehicleType === vt ? "bg-green-700 text-white" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
              >
                {vt}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle Number */}
        {vehicleType && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-green-100 p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                Vehicle Number ({vehicleType})
              </span>
            </div>
            {vehicles.filter((v) => v.type === vehicleType).length === 0 ? (
              <p className="text-sm text-gray-400 italic">
                No {vehicleType} vehicles saved. Add vehicles in Settings.
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {vehicles
                  .filter((v) => v.type === vehicleType)
                  .map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      data-ocid="direct_delivery.vehicle_number.button"
                      onClick={() => handleVehicleNumberSelect(v.number)}
                      className={`px-4 py-2 rounded-full font-bold text-sm transition-colors ${vehicleNumber === v.number ? "bg-green-700 text-white" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
                    >
                      {v.number}
                    </button>
                  ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Loading / Unloading Labour */}
        {vehicleNumber && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-green-100 p-3 flex flex-col gap-3"
          >
            {/* Loading Labour */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  Loading Labour
                </span>
                {loadingLabours.length > 0 && perLoadingLabour > 0 && (
                  <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                    ৳{Math.round(perLoadingLabour).toLocaleString()} / জন
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {loadingLabours.map((name) => (
                  <span
                    key={name}
                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-700 text-white text-sm font-semibold"
                  >
                    {name}
                    <button
                      type="button"
                      onClick={() =>
                        setLoadingLabours((prev) =>
                          prev.filter((n) => n !== name),
                        )
                      }
                      className="ml-1 text-green-200 hover:text-white font-bold leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  data-ocid="direct_delivery.loading_labour.input"
                  type="text"
                  value={customLoadingInput}
                  onChange={(e) => setCustomLoadingInput(e.target.value)}
                  placeholder="Add name..."
                  className="flex-1 border border-green-200 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customLoadingInput.trim()) {
                      setLoadingLabours((prev) => [
                        ...prev,
                        customLoadingInput.trim(),
                      ]);
                      setCustomLoadingInput("");
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customLoadingInput.trim()) {
                      setLoadingLabours((prev) => [
                        ...prev,
                        customLoadingInput.trim(),
                      ]);
                      setCustomLoadingInput("");
                    }
                  }}
                  className="px-3 py-1.5 rounded-full bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Unloading Labour */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  Unloading Labour
                </span>
                {unloadingLabours.length > 0 && perUnloadingLabour > 0 && (
                  <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                    ৳{Math.round(perUnloadingLabour).toLocaleString()} / জন
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {unloadingLabours.map((name) => (
                  <span
                    key={name}
                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-700 text-white text-sm font-semibold"
                  >
                    {name}
                    <button
                      type="button"
                      onClick={() =>
                        setUnloadingLabours((prev) =>
                          prev.filter((n) => n !== name),
                        )
                      }
                      className="ml-1 text-green-200 hover:text-white font-bold leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  data-ocid="direct_delivery.unloading_labour.input"
                  type="text"
                  value={customUnloadingInput}
                  onChange={(e) => setCustomUnloadingInput(e.target.value)}
                  placeholder="Add name..."
                  className="flex-1 border border-green-200 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customUnloadingInput.trim()) {
                      setUnloadingLabours((prev) => [
                        ...prev,
                        customUnloadingInput.trim(),
                      ]);
                      setCustomUnloadingInput("");
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customUnloadingInput.trim()) {
                      setUnloadingLabours((prev) => [
                        ...prev,
                        customUnloadingInput.trim(),
                      ]);
                      setCustomUnloadingInput("");
                    }
                  }}
                  className="px-3 py-1.5 rounded-full bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Calculated Amounts */}
        {vehicleType && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 rounded-xl shadow-sm border border-blue-100 p-3"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-2">
              Calculated Amounts
            </span>
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Rate (per 1000 bricks)
                </span>
                <span className="font-bold text-gray-900">
                  ৳{computedRate.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Amount</span>
                <span className="font-bold text-green-700">
                  {totalAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Loading Share</span>
                <span className="font-bold text-gray-900">
                  {loadingShare.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Unloading Share</span>
                <span className="font-bold text-gray-900">
                  {unloadingShare.toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Save Button */}
        <button
          type="button"
          data-ocid="direct_delivery.save_bottom.button"
          onClick={handleSave}
          className="w-full py-3.5 rounded-xl bg-green-600 hover:bg-green-700 transition-colors text-white font-bold text-base shadow-sm"
        >
          Save Direct Delivery
        </button>
      </main>
    </motion.div>
  );
}

function CompleteDeliveryPage({
  order,
  onBack,
  onSaveComplete,
}: {
  order: Order;
  onBack: () => void;
  onSaveComplete: (orderId: string, deliveryData: CompleteDeliveryData) => void;
}) {
  const [deliveryDate, setDeliveryDate] = useState(getTodayISO());
  const [vehicleType, setVehicleType] = useState<"Tractor" | "12 Wheel" | null>(
    null,
  );
  const [vehicleNumber, setVehicleNumber] = useState<string | null>(null);
  const [loadingLabours, setLoadingLabours] = useState<string[]>([]);
  const [unloadingLabours, setUnloadingLabours] = useState<string[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<"Not Paid" | "Paid Money">(
    "Not Paid",
  );
  const [customLoadingInput, setCustomLoadingInput] = useState("");
  const [customUnloadingInput, setCustomUnloadingInput] = useState("");

  const vehicles: {
    id: string;
    type: "Tractor" | "12 Wheel";
    number: string;
    loadingLabors: string[];
    unloadingLabors: string[];
  }[] = (() => {
    try {
      const saved = localStorage.getItem("sbco_vehicles");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  })();

  const rates: {
    tractorLocalRate: number;
    tractorOutsideRate: number;
    tractorSafetyBatsRate: number;
    wheelLocalRate: number;
    wheelSafetyBatsRate: number;
  } = (() => {
    try {
      const saved = localStorage.getItem("sbco_rates");
      return saved
        ? JSON.parse(saved)
        : {
            tractorLocalRate: 0,
            tractorOutsideRate: 0,
            tractorSafetyBatsRate: 0,
            wheelLocalRate: 0,
            wheelSafetyBatsRate: 0,
          };
    } catch {
      return {
        tractorLocalRate: 0,
        tractorOutsideRate: 0,
        tractorSafetyBatsRate: 0,
        wheelLocalRate: 0,
        wheelSafetyBatsRate: 0,
      };
    }
  })();

  const computedRate = (() => {
    if (!vehicleType) return 0;
    if (vehicleType === "Tractor") {
      return order.locationType === "Local"
        ? Number(rates.tractorLocalRate) || 0
        : Number(rates.tractorOutsideRate) || 0;
    }
    return Number(rates.wheelLocalRate) || 0;
  })();

  const totalAmount = (order.totalBricks / 1000) * computedRate;
  const loadingShare = totalAmount / 2;
  const unloadingShare = totalAmount / 2;
  const perLoadingLabour =
    loadingLabours.length > 0 ? loadingShare / loadingLabours.length : 0;
  const perUnloadingLabour =
    unloadingLabours.length > 0 ? unloadingShare / unloadingLabours.length : 0;

  const handleVehicleNumberSelect = (vNum: string) => {
    if (vehicleNumber === vNum) {
      setVehicleNumber(null);
      return;
    }
    setVehicleNumber(vNum);
    const found = vehicles.find((v) => v.number === vNum);
    if (found) {
      setLoadingLabours(found.loadingLabors || []);
      setUnloadingLabours(found.unloadingLabors || []);
    }
  };

  const handleSave = () => {
    onSaveComplete(order.id, {
      deliveryDate,
      vehicleType,
      vehicleNumber,
      loadingLabours,
      unloadingLabours,
      paymentStatus,
      rate: computedRate,
      totalAmount,
      loadingShare,
      unloadingShare,
      perLoadingLabour,
      perUnloadingLabour,
    });
  };

  const getBrickSummary = () => {
    if (!order.bricks || order.bricks.length === 0)
      return `${order.totalBricks} bricks`;
    return order.bricks
      .map((b) => {
        const qty = b.type === "Bats" ? (b.safety ?? 0) : b.quantity;
        return `${b.type} - ${qty.toLocaleString()}`;
      })
      .join(", ");
  };

  return (
    <motion.div
      key="complete-delivery"
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 60, opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="min-h-screen bg-green-50 flex flex-col pb-24"
    >
      {/* Header */}
      <header className="bg-white px-4 pt-3 pb-2 shadow-sm border-b border-green-100 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            data-ocid="complete_delivery.back.button"
            onClick={onBack}
            className="p-2 rounded-xl bg-green-50 hover:bg-green-100 transition-colors text-green-700 shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900 leading-tight">
              Complete Delivery
            </h1>
            <p className="text-sm text-green-600 font-medium mt-0.5">
              Assign Vehicle
            </p>
          </div>
          <button
            type="button"
            data-ocid="complete_delivery.save.button"
            onClick={handleSave}
            className="p-2 rounded-full bg-green-600 hover:bg-green-700 transition-colors text-white shrink-0"
          >
            <CheckCircle size={22} />
          </button>
        </div>
      </header>

      <main className="flex-1 p-3 flex flex-col gap-2">
        {/* Customer Info */}
        <div className="bg-white rounded-xl shadow-sm border border-green-100 p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-700"
                aria-label="Customer"
                role="img"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-gray-900 text-base leading-tight truncate">
                {order.customerName}
              </p>
              {order.address && (
                <p className="text-sm text-gray-500 truncate">
                  {order.address}
                </p>
              )}
            </div>
          </div>
          <div className="border-t border-gray-100 pt-2">
            <p className="text-sm text-gray-600">
              {order.totalBricks.toLocaleString()} bricks | {order.locationType}{" "}
              | {order.orderDate}
            </p>
            <p className="text-xs text-gray-400 mt-1">{getBrickSummary()}</p>
          </div>
        </div>

        {/* Delivery Date */}
        <div className="bg-white rounded-xl shadow-sm border border-green-100 p-3">
          <div className="flex items-center gap-2 mb-2">
            <CalendarDays size={16} className="text-green-700" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Delivery Date
            </span>
          </div>
          <input
            data-ocid="complete_delivery.date.input"
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            className="w-full border border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50"
          />
        </div>

        {/* Vehicle Type */}
        <div className="bg-white rounded-xl shadow-sm border border-green-100 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Truck size={18} className="text-green-700" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Vehicle Type
            </span>
          </div>
          <div className="flex gap-2">
            {(["Tractor", "12 Wheel"] as const).map((vt) => (
              <button
                key={vt}
                type="button"
                data-ocid={`complete_delivery.vehicle_type.${vt === "Tractor" ? "tractor" : "12wheel"}.button`}
                onClick={() => {
                  setVehicleType(vt);
                  setVehicleNumber(null);
                  setLoadingLabours([]);
                  setUnloadingLabours([]);
                }}
                className={`flex-1 py-1.5 rounded-full font-bold text-sm transition-colors ${vehicleType === vt ? "bg-green-700 text-white" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
              >
                {vt}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle Number */}
        {vehicleType && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-green-100 p-3"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-2">
              Vehicle Number
            </span>
            {vehicles.filter((v) => v.type === vehicleType).length === 0 ? (
              <p className="text-sm text-gray-400 italic">
                No {vehicleType} vehicles saved. Add vehicles in Settings.
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {vehicles
                  .filter((v) => v.type === vehicleType)
                  .map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => handleVehicleNumberSelect(v.number)}
                      className={`px-4 py-2 rounded-full font-bold text-sm transition-colors ${vehicleNumber === v.number ? "bg-green-700 text-white" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
                    >
                      {v.number}
                    </button>
                  ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Loading / Unloading Labour */}
        {vehicleNumber && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-green-100 p-3 flex flex-col gap-3"
          >
            {/* Loading Labour */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  Loading Labour
                </span>
                {loadingLabours.length > 0 && perLoadingLabour > 0 && (
                  <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                    ৳{Math.round(perLoadingLabour).toLocaleString()} / জন
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {loadingLabours.map((name) => (
                  <span
                    key={name}
                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-700 text-white text-sm font-semibold"
                  >
                    {name}
                    <button
                      type="button"
                      onClick={() =>
                        setLoadingLabours((prev) =>
                          prev.filter((n) => n !== name),
                        )
                      }
                      className="ml-1 text-green-200 hover:text-white font-bold leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  data-ocid="complete_delivery.loading_labour.input"
                  type="text"
                  value={customLoadingInput}
                  onChange={(e) => setCustomLoadingInput(e.target.value)}
                  placeholder="Add name..."
                  className="flex-1 border border-green-200 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customLoadingInput.trim()) {
                      setLoadingLabours((prev) => [
                        ...prev,
                        customLoadingInput.trim(),
                      ]);
                      setCustomLoadingInput("");
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customLoadingInput.trim()) {
                      setLoadingLabours((prev) => [
                        ...prev,
                        customLoadingInput.trim(),
                      ]);
                      setCustomLoadingInput("");
                    }
                  }}
                  className="px-3 py-1.5 rounded-full bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Unloading Labour */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  Unloading Labour
                </span>
                {unloadingLabours.length > 0 && perUnloadingLabour > 0 && (
                  <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                    ৳{Math.round(perUnloadingLabour).toLocaleString()} / জন
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {unloadingLabours.map((name) => (
                  <span
                    key={name}
                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-700 text-white text-sm font-semibold"
                  >
                    {name}
                    <button
                      type="button"
                      onClick={() =>
                        setUnloadingLabours((prev) =>
                          prev.filter((n) => n !== name),
                        )
                      }
                      className="ml-1 text-green-200 hover:text-white font-bold leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  data-ocid="complete_delivery.unloading_labour.input"
                  type="text"
                  value={customUnloadingInput}
                  onChange={(e) => setCustomUnloadingInput(e.target.value)}
                  placeholder="Add name..."
                  className="flex-1 border border-green-200 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customUnloadingInput.trim()) {
                      setUnloadingLabours((prev) => [
                        ...prev,
                        customUnloadingInput.trim(),
                      ]);
                      setCustomUnloadingInput("");
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customUnloadingInput.trim()) {
                      setUnloadingLabours((prev) => [
                        ...prev,
                        customUnloadingInput.trim(),
                      ]);
                      setCustomUnloadingInput("");
                    }
                  }}
                  className="px-3 py-1.5 rounded-full bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Auto Calculated Amounts */}
        {vehicleType && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 rounded-xl shadow-sm border border-blue-100 p-3"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-2">
              Auto Calculated Amounts
            </span>
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Rate (per 1000 bricks)
                </span>
                <span className="font-bold text-gray-900">
                  ৳{computedRate.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Amount</span>
                <span className="font-bold text-gray-900">
                  ৳{totalAmount.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-blue-200 my-1" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Loading Share</span>
                <span className="font-semibold text-gray-800">
                  ৳{loadingShare.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Unloading Share</span>
                <span className="font-semibold text-gray-800">
                  ৳{unloadingShare.toFixed(2)}
                </span>
              </div>
              {loadingLabours.length > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Per Loading Labour ({loadingLabours.length})
                  </span>
                  <span className="font-semibold text-green-700">
                    ৳{perLoadingLabour.toFixed(2)}
                  </span>
                </div>
              )}
              {unloadingLabours.length > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Per Unloading Labour ({unloadingLabours.length})
                  </span>
                  <span className="font-semibold text-green-700">
                    ৳{perUnloadingLabour.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Payment Status */}
        <div className="bg-white rounded-xl shadow-sm border border-green-100 p-3">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-2">
            Payment Status
          </span>
          <div className="flex gap-2">
            {(["Not Paid", "Paid Money"] as const).map((ps) => (
              <button
                key={ps}
                type="button"
                data-ocid={`complete_delivery.payment_status.${ps === "Not Paid" ? "not_paid" : "paid"}.button`}
                onClick={() => setPaymentStatus(ps)}
                className={`flex-1 py-1.5 rounded-full font-bold text-sm transition-colors ${paymentStatus === ps ? "bg-green-700 text-white" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
              >
                {ps === "Paid Money" ? "✓ " : ""}
                {ps}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Save Button - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-green-100 shadow-lg z-10">
        <button
          type="button"
          data-ocid="complete_delivery.submit_button"
          onClick={handleSave}
          className="w-full py-3 rounded-xl bg-green-700 hover:bg-green-800 text-white font-extrabold text-sm tracking-wide transition-colors shadow-lg"
        >
          Save as Complete
        </button>
      </div>
    </motion.div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

function CompletedDeliveriesPage({
  completedDeliveries,
  onBack,
  onDelete,
  onEdit,
}: {
  completedDeliveries: Order[];
  onBack: () => void;
  onDelete: (orderId: string) => void;
  onEdit: (order: Order) => void;
}) {
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [permTarget, setPermTarget] = useState<string | null>(null);
  const completedPrintRef = useRef<HTMLElement>(null);

  const filtered = completedDeliveries.filter((o) => {
    if (!filterFrom && !filterTo) return true;
    const d = new Date(o.orderDate);
    if (filterFrom && d < new Date(filterFrom)) return false;
    if (filterTo && d > new Date(filterTo)) return false;
    return true;
  });

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 1000);
  };

  return (
    <motion.div
      key="completed-list"
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 60, opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="min-h-screen bg-background flex flex-col"
    >
      <header className="bg-white px-3 pt-4 pb-2 flex items-center gap-2 shadow-sm print:hidden">
        <button
          type="button"
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 hover:bg-green-200 transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1">
          <h1 className="text-base font-extrabold text-foreground">
            Complete List
          </h1>
          <p className="text-xs text-muted-foreground">
            {filtered.length} Complete Deliveries
          </p>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          className="no-print flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors"
        >
          <Printer size={13} />
          Print
        </button>
      </header>

      <div className="px-3 py-2 bg-white border-b print:hidden">
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <label
              htmlFor="filter-from"
              className="text-[10px] font-bold text-green-700 uppercase tracking-wide flex items-center gap-1 mb-1"
            >
              <CalendarDays size={10} /> FROM
            </label>
            <input
              id="filter-from"
              type="date"
              value={filterFrom}
              onChange={(e) => setFilterFrom(e.target.value)}
              className="w-full px-2 py-1.5 rounded-lg border border-green-200 bg-green-50 text-xs"
            />
          </div>
          <span className="text-muted-foreground text-sm mt-4">—</span>
          <div className="flex-1">
            <label
              htmlFor="filter-to"
              className="text-[10px] font-bold text-green-700 uppercase tracking-wide flex items-center gap-1 mb-1"
            >
              <CalendarDays size={10} /> TO
            </label>
            <input
              id="filter-to"
              type="date"
              value={filterTo}
              onChange={(e) => setFilterTo(e.target.value)}
              className="w-full px-2 py-1.5 rounded-lg border border-green-200 bg-green-50 text-xs"
            />
          </div>
        </div>
      </div>

      <main
        ref={completedPrintRef}
        className="flex-1 p-3 overflow-y-auto completed-print-list"
      >
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <Truck size={40} className="text-green-200" />
            <p className="text-sm text-muted-foreground">
              No completed deliveries yet
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map((order, i) => (
              <motion.div
                key={order.id}
                data-ocid={`completed_delivery.item.${i + 1}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: i * 0.04, duration: 0.2 }}
                className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden mb-2"
              >
                <div className="px-4 pt-3 pb-2">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-extrabold text-gray-900 truncate">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {order.address || "—"} · INV#{order.invoiceNumber}
                      </p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        type="button"
                        data-ocid={`completed_delivery.item.${i + 1}.edit_button`}
                        onClick={() => onEdit(order)}
                        className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors"
                      >
                        <Pencil size={12} className="text-blue-700" />
                      </button>
                      <button
                        type="button"
                        data-ocid={`completed_delivery.item.${i + 1}.delete_button`}
                        onClick={() => setPermTarget(order.id)}
                        className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors"
                      >
                        <Trash2 size={12} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-gray-500 mb-2">
                    {order.completionData?.vehicleType && (
                      <span className="font-semibold text-primary">
                        {order.completionData.vehicleType} ·{" "}
                        {order.completionData.vehicleNumber}
                      </span>
                    )}
                    <span>{order.orderDate}</span>
                  </div>
                  {order.completionData && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {[
                        ...new Set([
                          ...(order.completionData.loadingLabours || []),
                          ...(order.completionData.unloadingLabours || []),
                        ]),
                      ].map((name) => (
                        <span
                          key={name}
                          className="text-[10px] px-2 py-0.5 bg-green-50 border border-green-200 text-green-700 rounded-full font-semibold"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-gray-100">
                    {(
                      [
                        ["BRICKS", order.totalBricks.toLocaleString()],
                        ["TOTAL", order.totalAmount.toLocaleString()],
                        [
                          "LABOUR",
                          order.completionData
                            ? order.completionData.totalAmount.toLocaleString()
                            : "0",
                        ],
                      ] as [string, string][]
                    ).map(([label, val]) => (
                      <div key={label} className="text-center">
                        <p className="text-[9px] font-bold uppercase text-gray-400 tracking-wider">
                          {label}
                        </p>
                        <p className="text-xs font-extrabold text-gray-800 mt-0.5">
                          {val}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </main>

      <PermissionDialog
        open={permTarget !== null}
        onClose={() => setPermTarget(null)}
        onConfirm={() => {
          if (permTarget) {
            onDelete(permTarget);
            setPermTarget(null);
          }
        }}
      />
    </motion.div>
  );
}
function WeeklyLabourReportPage({
  onBack,
  completedDeliveries,
  embedded,
}: {
  onBack: () => void;
  completedDeliveries: Order[];
  embedded?: boolean;
}) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 1000);
  };

  // Filter by date range if set
  const filteredDeliveries = completedDeliveries.filter((o) => {
    if (!fromDate && !toDate) return true;
    const d = new Date(o.createdAt);
    if (fromDate && d < new Date(fromDate)) return false;
    if (toDate && d > new Date(`${toDate}T23:59:59`)) return false;
    return true;
  });

  // Derive dates and workers from filtered deliveries
  const derivedData = (() => {
    const dateWorkerMap: Record<string, Record<string, number>> = {};
    const allWorkers = new Set<string>();
    const allDates = new Set<string>();

    for (const order of filteredDeliveries) {
      const cd = order.completionData;
      if (!cd) continue;
      if (cd.loadingLabours.length === 0 && cd.unloadingLabours.length === 0)
        continue;

      const d = new Date(order.createdAt);
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yy = String(d.getFullYear()).slice(-2);
      const dateLabel = `${dd}/${mm}/${yy}`;

      allDates.add(dateLabel);

      for (const name of cd.loadingLabours) {
        allWorkers.add(name);
        if (!dateWorkerMap[dateLabel]) dateWorkerMap[dateLabel] = {};
        dateWorkerMap[dateLabel][name] =
          (dateWorkerMap[dateLabel][name] || 0) + cd.perLoadingLabour;
      }
      for (const name of cd.unloadingLabours) {
        allWorkers.add(name);
        if (!dateWorkerMap[dateLabel]) dateWorkerMap[dateLabel] = {};
        dateWorkerMap[dateLabel][name] =
          (dateWorkerMap[dateLabel][name] || 0) + cd.perUnloadingLabour;
      }
    }

    const sortedDates = Array.from(allDates).sort((a, b) => {
      const parse = (s: string) => {
        const [dPart, mPart, yPart] = s.split("/");
        return new Date(
          2000 + Number(yPart),
          Number(mPart) - 1,
          Number(dPart),
        ).getTime();
      };
      return parse(a) - parse(b);
    });

    const dates = sortedDates.slice(-7);
    const workers = Array.from(allWorkers).sort();
    return { dates, workers, dateWorkerMap };
  })();

  const { dates, workers, dateWorkerMap } = derivedData;
  const hasData = dates.length > 0 && workers.length > 0;

  const getAmount = (date: string, worker: string): number | null => {
    const val = dateWorkerMap[date]?.[worker];
    return val !== undefined ? val : null;
  };

  const rowTotal = (worker: string) =>
    dates.reduce((s, d) => s + (dateWorkerMap[d]?.[worker] || 0), 0);
  const grandTotal = workers.reduce((s, w) => s + rowTotal(w), 0);

  return (
    <motion.div
      key="weekly-labour-report"
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 60, opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="min-h-screen bg-gray-100 flex flex-col"
    >
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; overflow: visible !important; }
          * { overflow: visible !important; max-height: none !important; }
          .report-content * { color: #000 !important; background: white !important; }
          .report-title-main { font-size: 20pt !important; font-weight: 900 !important; color: #000 !important; text-align: center !important; }
          .report-title-sub { font-size: 14pt !important; font-weight: 700 !important; color: #000 !important; text-align: center !important; }
          table { border-collapse: collapse !important; width: 100% !important; }
          th { background: white !important; color: #000 !important; border: 1px solid #000 !important; padding: 6px 8px !important; font-weight: 700 !important; }
          td { background: white !important; color: #000 !important; border: 1px solid #000 !important; padding: 5px 8px !important; }
          tr { background: white !important; }
          .total-col { font-weight: 700 !important; color: #000 !important; }
          .grand-total-row td { font-weight: 700 !important; color: #000 !important; background: white !important; border-top: 2px solid #000 !important; }
          @page { margin: 15mm; }
        }
      `}</style>

      {!embedded && (
        <header
          className="no-print flex items-center justify-between px-4 py-3 shadow"
          style={{ background: "#1a4d2e" }}
          data-ocid="weekly_labour.page"
        >
          <button
            type="button"
            onClick={onBack}
            data-ocid="weekly_labour.back.button"
            className="text-white flex items-center gap-1 font-bold text-sm"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <span className="text-white font-bold text-base">Weekly Report</span>
        </header>
      )}

      {/* Toolbar: From/To + Print + PDF */}
      <div className="no-print flex flex-wrap gap-2 items-center px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-1">
          <label
            htmlFor="weekly-from"
            className="text-xs font-bold text-gray-600"
          >
            From:
          </label>
          <input
            id="weekly-from"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="text-xs border border-gray-300 rounded px-2 py-1"
          />
        </div>
        <div className="flex items-center gap-1">
          <label
            htmlFor="weekly-to"
            className="text-xs font-bold text-gray-600"
          >
            To:
          </label>
          <input
            id="weekly-to"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="text-xs border border-gray-300 rounded px-2 py-1"
          />
        </div>
        <button
          type="button"
          onClick={handlePrint}
          data-ocid="weekly_labour.print.button"
          className="no-print flex items-center gap-1 bg-[#1a4d2e] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#133d22]"
        >
          🖨 Print
        </button>
      </div>

      <main className="flex-1 p-3">
        <div
          ref={reportRef}
          className="report-content max-w-5xl mx-auto space-y-4"
        >
          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200 text-center">
            <div className="report-title-main text-xl font-extrabold uppercase tracking-widest text-black">
              S B C O BRICK FIELD
            </div>
            <div className="report-title-sub text-base font-extrabold uppercase tracking-widest text-black">
              WEEKLY LABOURS REPORT
            </div>
            {dates.length > 0 && (
              <div className="text-xs text-gray-500 mt-1 font-semibold">
                {dates[0]}
                {dates.length > 1 ? ` – ${dates[dates.length - 1]}` : ""}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
            {!hasData ? (
              <div
                className="text-center py-14 px-6 text-gray-500 font-semibold text-sm"
                data-ocid="weekly_labour.empty_state"
              >
                No labour data yet. Complete a delivery with labour details to
                see the weekly report.
              </div>
            ) : (
              <table
                className="w-full border-collapse text-sm"
                style={{ borderCollapse: "collapse" }}
              >
                <thead>
                  <tr style={{ background: "#1a4d2e" }}>
                    <th
                      className="text-left px-3 py-2.5 font-bold text-white text-xs uppercase tracking-wider"
                      style={{
                        border: "1px solid #333",
                        position: "sticky",
                        left: 0,
                        background: "#1a4d2e",
                        minWidth: 90,
                      }}
                    >
                      Name
                    </th>
                    {dates.map((d) => (
                      <th
                        key={d}
                        className="text-center px-2 py-2.5 font-bold text-white text-xs"
                        style={{
                          border: "1px solid #333",
                          minWidth: 70,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {d}
                      </th>
                    ))}
                    <th
                      className="text-center px-2 py-2.5 font-bold text-xs uppercase"
                      style={{
                        border: "1px solid #333",
                        color: "#fca5a5",
                        minWidth: 70,
                      }}
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map((worker, wi) => (
                    <tr
                      key={worker}
                      style={{ background: wi % 2 === 0 ? "white" : "#f9fafb" }}
                    >
                      <td
                        className="font-bold text-sm px-3 py-2"
                        style={{
                          border: "1px solid #333",
                          color: "#1a4d2e",
                          position: "sticky",
                          left: 0,
                          background: wi % 2 === 0 ? "white" : "#f9fafb",
                        }}
                      >
                        {worker}
                      </td>
                      {dates.map((d) => {
                        const amt = getAmount(d, worker);
                        return (
                          <td
                            key={d}
                            className="text-center py-2 px-1"
                            style={{ border: "1px solid #333" }}
                          >
                            {amt !== null ? (
                              <span className="font-bold text-gray-800">
                                {Number(amt).toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">NIL</span>
                            )}
                          </td>
                        );
                      })}
                      <td
                        className="total-col text-center font-extrabold py-2 px-2"
                        style={{ border: "1px solid #333", color: "#dc2626" }}
                      >
                        {Number(rowTotal(worker)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr
                    className="grand-total-row"
                    style={{ background: "#fff7f7" }}
                  >
                    <td
                      className="font-extrabold text-xs px-3 py-2 uppercase tracking-wider"
                      style={{
                        border: "1px solid #333",
                        color: "#dc2626",
                        position: "sticky",
                        left: 0,
                        background: "#fff7f7",
                      }}
                    >
                      Grand Total
                    </td>
                    {dates.map((d) => {
                      const dayTotal = workers.reduce(
                        (s, w) => s + (dateWorkerMap[d]?.[w] || 0),
                        0,
                      );
                      return (
                        <td
                          key={d}
                          className="text-center font-bold py-2 text-xs"
                          style={{ border: "1px solid #333", color: "#dc2626" }}
                        >
                          {dayTotal > 0 ? Number(dayTotal).toFixed(2) : "—"}
                        </td>
                      );
                    })}
                    <td
                      className="text-center font-extrabold py-2 text-sm"
                      style={{ border: "1px solid #333", color: "#dc2626" }}
                    >
                      {Number(grandTotal).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </motion.div>
  );
}

function DailyLabourReportPage({
  onBack,
  embedded,
  completedDeliveries = [],
}: {
  onBack: () => void;
  embedded?: boolean;
  completedDeliveries?: Order[];
}) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 1000);
  };

  // Filter by date range using saved delivery/order date
  const filtered = completedDeliveries.filter((o) => {
    const cd = o.completionData;
    const dateStr = cd?.deliveryDate || o.orderDate || "";
    if (!dateStr) return !fromDate && !toDate;
    const d = new Date(dateStr);
    if (fromDate && d < new Date(fromDate)) return false;
    if (toDate && d > new Date(`${toDate}T23:59:59`)) return false;
    return true;
  });

  // Group by date + vehicle
  type CardRow = {
    address: string;
    bricks: number;
    rate: number;
    amount: number;
  };
  type DateVehicleCard = {
    date: string;
    vehicle: string;
    rows: CardRow[];
    total: number;
  };

  const cardMap: Record<string, DateVehicleCard> = {};

  for (const order of filtered) {
    const cd = order.completionData;
    if (!cd || !cd.vehicleNumber) continue;
    const dateStr = cd.deliveryDate || order.orderDate || "";
    const vn = cd.vehicleNumber;
    const key = `${dateStr}__${vn}`;
    if (!cardMap[key])
      cardMap[key] = { date: dateStr, vehicle: vn, rows: [], total: 0 };

    const totalBricks =
      order.bricks?.reduce(
        (s, b) => s + (b.type === "Bats" ? b.safety || 0 : b.quantity || 0),
        0,
      ) || 0;
    const rate = cd.rate || 0;
    const amount = (totalBricks / 1000) * rate;

    cardMap[key].rows.push({
      address: order.address || "—",
      bricks: totalBricks,
      rate,
      amount,
    });
    cardMap[key].total += amount;
  }

  // Sort cards by date descending (latest first)
  const cards = Object.values(cardMap).sort((a, b) => {
    const da = new Date(a.date).getTime() || 0;
    const db = new Date(b.date).getTime() || 0;
    return db - da;
  });

  const formatCardDate = (dateStr: string) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  return (
    <motion.div
      key="daily-labour-report"
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 60, opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="min-h-screen bg-gray-100 flex flex-col"
    >
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; overflow: visible !important; margin: 0 !important; }
          * { overflow: visible !important; max-height: none !important; }
          .report-card { box-shadow: none !important; border: 1px solid #000 !important; break-inside: avoid; margin-bottom: 16px; }
          .report-card-header { background: white !important; color: #000 !important; border-bottom: 1px solid #000 !important; }
          .report-card-header-text { font-size: 11pt !important; font-weight: 700 !important; color: #000 !important; }
          .report-title-main { font-size: 18pt !important; font-weight: 900 !important; color: #000 !important; }
          .report-title-sub { font-size: 13pt !important; font-weight: 700 !important; color: #000 !important; }
          table { border-collapse: collapse !important; width: 100% !important; }
          th { background: white !important; color: #000 !important; border: 1px solid #000 !important; padding: 5px 8px !important; font-weight: 700 !important; }
          td { background: white !important; color: #000 !important; border: 1px solid #000 !important; padding: 4px 8px !important; }
          .card-total-row { font-weight: 700 !important; color: #000 !important; border-top: 2px solid #000 !important; }
          @page { margin: 15mm; size: A4; }
        }
      `}</style>

      {!embedded && (
        <header className="no-print bg-[#1a4d2e] text-white px-4 py-4 flex items-center gap-3 shadow">
          <button
            type="button"
            data-ocid="daily_labour.nav.back.button"
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="flex-1 text-lg font-bold uppercase tracking-widest">
            Daily Labour Report
          </h1>
        </header>
      )}

      {/* Toolbar */}
      <div className="no-print flex flex-wrap gap-2 items-center px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-1">
          <label htmlFor="dlr-from" className="text-xs font-bold text-gray-600">
            From:
          </label>
          <input
            id="dlr-from"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="text-xs border border-gray-300 rounded px-2 py-1"
          />
        </div>
        <div className="flex items-center gap-1">
          <label htmlFor="dlr-to" className="text-xs font-bold text-gray-600">
            To:
          </label>
          <input
            id="dlr-to"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="text-xs border border-gray-300 rounded px-2 py-1"
          />
        </div>
        <button
          type="button"
          onClick={handlePrint}
          data-ocid="daily_labour.print.button"
          className="flex items-center gap-1 bg-[#1a4d2e] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#133d22]"
        >
          🖨 Print
        </button>
      </div>

      <main className="flex-1 p-4 space-y-4 max-w-2xl mx-auto w-full">
        {/* Report title */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
          <h2 className="report-title-main text-xl font-black uppercase tracking-widest text-black">
            S B C O BRICK FIELD
          </h2>
          <h3 className="report-title-sub text-sm font-bold uppercase tracking-widest text-black mt-1">
            DAILY LABOURS REPORT
          </h3>
          {(fromDate || toDate) && (
            <p className="text-xs text-gray-500 mt-2">
              {fromDate && `From: ${fromDate}`}
              {fromDate && toDate && " — "}
              {toDate && `To: ${toDate}`}
            </p>
          )}
        </div>

        {cards.length === 0 ? (
          <div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
            data-ocid="daily_labour.empty_state"
          >
            <p className="text-sm text-gray-400 font-medium">
              কোনো ডেটা পাওয়া যায়নি
            </p>
            <p className="text-xs text-gray-300 mt-1">
              Complete Delivery করলে এখানে দেখাবে
            </p>
          </div>
        ) : (
          cards.map((card) => (
            <div
              key={`${card.date}-${card.vehicle}`}
              className="report-card bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
            >
              {/* Card header */}
              <div className="report-card-header bg-[#1a4d2e] px-4 py-2.5 flex items-center justify-between">
                <span className="report-card-header-text text-white text-sm font-bold uppercase tracking-wide">
                  VEHICLE: {card.vehicle}
                </span>
                <span className="report-card-header-text text-white text-sm font-bold">
                  DATE: {formatCardDate(card.date)}
                </span>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-3 py-2 text-xs font-bold uppercase text-left">
                        Address
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-xs font-bold uppercase text-center">
                        Bricks
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-xs font-bold uppercase text-center">
                        Rate
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-xs font-bold uppercase text-right">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {card.rows.map((row, ri) => (
                      <tr
                        key={`row-${ri}-${row.address}`}
                        className={ri % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                      >
                        <td className="border border-gray-200 px-3 py-2 text-xs">
                          {row.address}
                        </td>
                        <td className="border border-gray-200 px-3 py-2 text-xs text-center">
                          {row.bricks.toLocaleString()}
                        </td>
                        <td className="border border-gray-200 px-3 py-2 text-xs text-center">
                          {row.rate}
                        </td>
                        <td className="border border-gray-200 px-3 py-2 text-xs text-right font-semibold">
                          {row.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Card total */}
              <div className="card-total-row px-4 py-2.5 flex items-center justify-between bg-gray-50 border-t border-gray-200">
                <span className="text-xs font-bold uppercase text-gray-600">
                  Total Amount
                </span>
                <span className="text-sm font-extrabold text-[#1a4d2e]">
                  {card.total.toFixed(2)}
                </span>
              </div>
            </div>
          ))
        )}
      </main>
    </motion.div>
  );
}

function ClosedOrdersPage({
  orders,
  completedDeliveries,
  onBack,
  onEdit,
  onDelete,
}: {
  orders: Order[];
  completedDeliveries: Order[];
  onBack: () => void;
  onEdit: (order: Order) => void;
  onDelete: (orderId: string) => void;
}) {
  const [historyOrder, setHistoryOrder] = useState<Order | null>(null);
  const [permTarget, setPermTarget] = useState<string | null>(null);

  return (
    <motion.div
      key="closed-orders"
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 60, opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="min-h-screen bg-background flex flex-col"
    >
      <header className="bg-primary text-primary-foreground px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button
          type="button"
          data-ocid="closed_orders.back.button"
          onClick={onBack}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold uppercase tracking-widest">
          Closed Orders
        </h1>
        <span className="ml-auto bg-white/20 text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full">
          {orders.length}
        </span>
      </header>

      <main className="flex-1 p-3 space-y-2 pb-6">
        {orders.length === 0 ? (
          <div
            data-ocid="closed_orders.empty_state"
            className="flex flex-col items-center justify-center gap-3 py-16"
          >
            <CheckCircle size={40} className="text-primary/30" />
            <p className="text-sm text-muted-foreground font-medium">
              কোনো বন্ধ অর্ডার নেই
            </p>
          </div>
        ) : (
          orders.map((order, i) => (
            <div
              key={order.id}
              data-ocid={`closed_orders.item.${i + 1}`}
              className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
            >
              <div className="bg-brand-mint-badge px-4 py-3 flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold text-foreground leading-tight truncate">
                    {order.customerName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {order.address || "—"}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    data-ocid={`closed_orders.item.${i + 1}.history.button`}
                    onClick={() => setHistoryOrder(order)}
                    className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                  >
                    <Clock size={14} className="text-primary" />
                  </button>
                  <button
                    type="button"
                    data-ocid={`closed_orders.item.${i + 1}.edit_button`}
                    onClick={() => onEdit(order)}
                    className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200 transition-colors"
                  >
                    <Pencil size={13} className="text-green-700" />
                  </button>
                  <button
                    type="button"
                    data-ocid={`closed_orders.item.${i + 1}.delete_button`}
                    onClick={() => setPermTarget(order.id)}
                    className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors"
                  >
                    <Trash2 size={13} className="text-red-600" />
                  </button>
                </div>
              </div>

              <div className="px-4 py-2.5 space-y-1.5">
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                  <span>📅 {order.orderDate}</span>
                  <span>📞 {order.phoneNumber}</span>
                  <span>INV# {order.invoiceNumber}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {order.bricks.map((b, j) => (
                    <span
                      key={`${b.type}-${j}`}
                      className="bg-brand-mint-badge text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    >
                      {b.type}: {(b.quantity || 0).toLocaleString()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="h-px bg-border" />
              <div className="grid grid-cols-4 gap-1 px-4 py-2.5">
                {(
                  [
                    ["BRICKS", order.totalBricks.toLocaleString()],
                    ["TOTAL AMT", `₹${order.totalAmount.toLocaleString()}`],
                    ["PAID", `₹${order.paidAmount.toLocaleString()}`],
                    ["DUE", `₹${order.dueAmount.toLocaleString()}`],
                  ] as [string, string][]
                ).map(([label, val]) => (
                  <div key={label} className="text-center">
                    <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-wider">
                      {label}
                    </p>
                    <p className="text-xs font-extrabold text-foreground mt-0.5">
                      {val}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </main>

      <OrderHistoryModal
        open={historyOrder !== null}
        order={historyOrder}
        completedDeliveries={completedDeliveries}
        onClose={() => setHistoryOrder(null)}
      />
      <PermissionDialog
        open={permTarget !== null}
        onClose={() => setPermTarget(null)}
        onConfirm={() => {
          if (permTarget) {
            onDelete(permTarget);
            setPermTarget(null);
          }
        }}
      />
    </motion.div>
  );
}

function EditOrderDialog({
  order,
  onClose,
  onSave,
}: {
  order: Order | null;
  onClose: () => void;
  onSave: (updated: Order) => void;
}) {
  const [name, setName] = useState(order?.customerName ?? "");
  const [phone, setPhone] = useState(order?.phoneNumber ?? "");
  const [address, setAddress] = useState(order?.address ?? "");
  const [invoice, setInvoice] = useState(order?.invoiceNumber ?? "");
  const [totalAmount, setTotalAmount] = useState(
    String(order?.totalAmount ?? ""),
  );
  const [paidAmount, setPaidAmount] = useState(String(order?.paidAmount ?? ""));
  const [brickList, setBrickList] = useState<BrickSelection[]>(
    order?.bricks ?? [],
  );

  useEffect(() => {
    if (order) {
      setName(order.customerName);
      setPhone(order.phoneNumber ?? "");
      setAddress(order.address ?? "");
      setInvoice(order.invoiceNumber ?? "");
      setTotalAmount(String(order.totalAmount));
      setPaidAmount(String(order.paidAmount));
      setBrickList(order.bricks ?? []);
    }
  }, [order]);

  const handleSave = () => {
    if (!order) return;
    const total = Number.parseFloat(totalAmount) || 0;
    const paid = Number.parseFloat(paidAmount) || 0;
    const newTotalBricks = brickList.reduce(
      (s, b) => s + (b.type === "Bats" ? b.safety || 0 : b.quantity || 0),
      0,
    );
    onSave({
      ...order,
      customerName: name,
      phoneNumber: phone,
      address,
      invoiceNumber: invoice,
      totalAmount: total,
      paidAmount: paid,
      dueAmount: Math.max(0, total - paid),
      bricks: brickList,
      totalBricks: newTotalBricks,
    });
    toast.success("Order updated!");
    onClose();
  };

  return (
    <Dialog
      open={order !== null}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent
        data-ocid="edit_order.dialog"
        className="max-w-sm mx-4 max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Edit Order</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div>
            <Label className="text-xs font-semibold">Customer Name</Label>
            <Input
              data-ocid="edit_order.input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs font-semibold">Phone</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="numeric"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs font-semibold">Address</Label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs font-semibold">Invoice #</Label>
            <Input
              value={invoice}
              onChange={(e) => setInvoice(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs font-semibold">Total Amount</Label>
              <Input
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                inputMode="numeric"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Paid Amount</Label>
              <Input
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                inputMode="numeric"
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide">
              Brick Types
            </Label>
            <div className="mt-1 space-y-2">
              {brickList.map((b, idx) => (
                <div key={b.type} className="flex items-center gap-2">
                  <span className="text-xs flex-1 font-medium">{b.type}</span>
                  <Input
                    value={b.type === "Bats" ? (b.safety ?? 0) : b.quantity}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      setBrickList((prev) =>
                        prev.map((x, i) =>
                          i === idx
                            ? x.type === "Bats"
                              ? { ...x, safety: val }
                              : { ...x, quantity: val }
                            : x,
                        ),
                      );
                    }}
                    inputMode="numeric"
                    className="w-20 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setBrickList((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {BRICK_TYPES.filter(
                (t) => !brickList.find((b) => b.type === t),
              ).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() =>
                    setBrickList((prev) => [...prev, { type: t, quantity: 0 }])
                  }
                  className="text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-colors"
                >
                  + {t}
                </button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="flex gap-2">
          <button
            type="button"
            data-ocid="edit_order.cancel_button"
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
          >
            বাতিল
          </button>
          <button
            type="button"
            data-ocid="edit_order.save_button"
            onClick={handleSave}
            className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function App() {
  const [view, setView] = useState<View>("dashboard");
  const [pendingOrderReturnView, setPendingOrderReturnView] =
    useState<View>("total-orders");
  const navStackRef = useRef<View[]>([]);

  useEffect(() => {
    const handlePopState = () => {
      const prev = navStackRef.current.pop();
      if (prev) {
        setView(prev);
        setSelectedPendingOrder(null);
        setSelectedCompleteOrder(null);
      } else {
        setView("dashboard");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem("sbco_orders");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [trash, setTrash] = useState<TrashItem[]>(() => {
    try {
      const saved = localStorage.getItem("sbco_trash");
      const items: TrashItem[] = saved ? JSON.parse(saved) : [];
      const sevenDaysAgo = new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000,
      ).toISOString();
      return items.filter((t) => t.deletedAt > sevenDaysAgo);
    } catch {
      return [];
    }
  });

  const [lastBackupTime, setLastBackupTime] = useState<string>(
    () => localStorage.getItem("sbco_lastBackup") || "",
  );

  useEffect(() => {
    localStorage.setItem("sbco_trash", JSON.stringify(trash));
  }, [trash]);
  const [completedDeliveries, setCompletedDeliveries] = useState<Order[]>(
    () => {
      try {
        const saved = localStorage.getItem("sbco_completed");
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    },
  );
  useEffect(() => {
    localStorage.setItem("sbco_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("sbco_completed", JSON.stringify(completedDeliveries));
  }, [completedDeliveries]);

  const [pendingDeliveries, setPendingDeliveries] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem("sbco_pending_deliveries");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "sbco_pending_deliveries",
      JSON.stringify(pendingDeliveries),
    );
  }, [pendingDeliveries]);

  const [selectedPendingOrder, setSelectedPendingOrder] =
    useState<Order | null>(null);
  const [selectedCompleteOrder, setSelectedCompleteOrder] =
    useState<Order | null>(null);
  const now = useLiveClock();

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const updateOrder = (updated: Order) => {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  };

  const autoBackup = () => {
    try {
      const data: Record<string, any> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)!;
        if (key === "sbco_autobackup") continue;
        try {
          data[key] = JSON.parse(localStorage.getItem(key)!);
        } catch {
          data[key] = localStorage.getItem(key);
        }
      }
      localStorage.setItem(
        "sbco_autobackup",
        JSON.stringify({ savedAt: new Date().toISOString(), data }),
      );
    } catch {
      /* silent */
    }
  };

  const deleteOrder = (orderId: string) => {
    const item = orders.find((o) => o.id === orderId);
    if (item) {
      setTrash((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "order",
          item,
          deletedAt: new Date().toISOString(),
        },
      ]);
    }
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    setTimeout(autoBackup, 100);
  };

  const markAsDelivered = (
    orderId: string,
    deliveryData?: CompleteDeliveryData,
  ) => {
    const order = pendingDeliveries.find((o) => o.id === orderId);
    if (order) {
      const completed = deliveryData
        ? { ...order, completionData: deliveryData }
        : order;
      setPendingDeliveries((prev) => prev.filter((o) => o.id !== orderId));
      setCompletedDeliveries((prev) => [completed, ...prev]);
      const deliveredQty = order.totalBricks;
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === orderId) {
            return {
              ...o,
              deliveredBricks: (o.deliveredBricks || 0) + deliveredQty,
            };
          }
          return o;
        }),
      );
      toast.success(`${order.customerName} marked as delivered!`);
    }
  };

  const deleteCompletedDelivery = (orderId: string) => {
    const item = completedDeliveries.find((o) => o.id === orderId);
    if (item) {
      setTrash((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "completedDelivery",
          item,
          deletedAt: new Date().toISOString(),
        },
      ]);
    }
    setCompletedDeliveries((prev) => prev.filter((o) => o.id !== orderId));
    setTimeout(autoBackup, 100);
  };

  const deleteDelivery = (orderId: string) => {
    const item = pendingDeliveries.find((o) => o.id === orderId);
    if (item) {
      setTrash((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "delivery",
          item,
          deletedAt: new Date().toISOString(),
        },
      ]);
    }
    setPendingDeliveries((prev) => prev.filter((o) => o.id !== orderId));
    setTimeout(autoBackup, 100);
  };

  const handleViewPending = (order: Order) => {
    setSelectedPendingOrder(order);
    setPendingOrderReturnView("total-orders");
    navStackRef.current.push(view);
    window.history.pushState({ view: "pending-order" }, "");
    setView("pending-order");
  };

  const closedOrders = orders.filter(
    (o) => o.dueAmount === 0 && (o.deliveredBricks || 0) >= o.totalBricks,
  );

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
                  value={String(
                    orders.filter(
                      (o) =>
                        !(
                          o.dueAmount === 0 &&
                          (o.deliveredBricks || 0) >= o.totalBricks
                        ),
                    ).length,
                  )}
                  clickable
                  onClick={() => setView("total-orders")}
                />
                <StatCard
                  data-ocid="closed_orders.card"
                  icon={<CheckCircle size={iconSize} className={iconClass} />}
                  title="Closed Orders"
                  value={String(closedOrders.length)}
                  clickable
                  onClick={() => setView("closed-orders")}
                />
                <StatCard
                  data-ocid="pending_delivery.card"
                  icon={<Truck size={iconSize} className={iconClass} />}
                  title="Pending Delivery"
                  value={String(pendingDeliveries.length)}
                  clickable
                  onClick={() => setView("pending-delivery")}
                />
                <StatCard
                  data-ocid="complete_delivery.card"
                  icon={<Package size={iconSize} className={iconClass} />}
                  title="Complete Delivery"
                  value={String(completedDeliveries.length)}
                  clickable
                  onClick={() => {
                    navStackRef.current.push("dashboard");
                    window.history.pushState({ view: "completed-list" }, "");
                    setView("completed-list");
                  }}
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
                  onClick={() => setView("settings")}
                />
                <ActionCard
                  data-ocid="reports.open_modal_button"
                  icon={<BarChart2 size={20} className={iconClass} />}
                  title="Reports"
                  subtitle="Tap to open"
                  onClick={() => {
                    navStackRef.current.push("dashboard");
                    window.history.pushState({ view: "reports" }, "");
                    setView("reports");
                  }}
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
            onViewPending={handleViewPending}
            onMarkPending={(order) => {
              handleViewPending(order);
            }}
            completedDeliveries={completedDeliveries}
          />
        ) : view === "pending-delivery" ? (
          <PendingDeliveryPage
            key="pending-delivery"
            orders={pendingDeliveries}
            onBack={() => setView("dashboard")}
            onDelete={deleteDelivery}
            onCompleteDelivery={(order) => {
              setSelectedCompleteOrder(order);
              navStackRef.current.push("pending-delivery");
              window.history.pushState({ view: "complete-delivery" }, "");
              setView("complete-delivery");
            }}
            onEditDelivery={(order) => {
              setSelectedPendingOrder(order);
              setPendingOrderReturnView("pending-delivery");
              navStackRef.current.push("pending-delivery");
              window.history.pushState({ view: "pending-order" }, "");
              setView("pending-order");
            }}
          />
        ) : view === "pending-order" && selectedPendingOrder ? (
          <PendingOrderDetailPage
            key="pending-order"
            order={selectedPendingOrder}
            onBack={() => {
              setView(pendingOrderReturnView);
              setSelectedPendingOrder(null);
            }}
            onSave={(updated) => {
              const originalOrder = orders.find((o) => o.id === updated.id);
              updateOrder({
                ...updated,
                totalBricks: originalOrder
                  ? originalOrder.totalBricks
                  : updated.totalBricks,
                bricks: originalOrder ? originalOrder.bricks : updated.bricks,
              });
              setPendingDeliveries((prev) => {
                if (prev.find((p) => p.id === updated.id)) return prev;
                return [updated, ...prev];
              });
              setView(pendingOrderReturnView);
              setSelectedPendingOrder(null);
            }}
          />
        ) : view === "complete-delivery" && selectedCompleteOrder ? (
          <CompleteDeliveryPage
            key="complete-delivery"
            order={selectedCompleteOrder}
            onBack={() => {
              setSelectedCompleteOrder(null);
              setView("pending-delivery");
            }}
            onSaveComplete={(orderId, data) => {
              markAsDelivered(orderId, data);
              setSelectedCompleteOrder(null);
              setView("pending-delivery");
            }}
          />
        ) : view === "completed-list" ? (
          <CompletedDeliveriesPage
            key="completed-list"
            completedDeliveries={completedDeliveries}
            onBack={() => {
              const prev = navStackRef.current.pop();
              setView(prev ?? "dashboard");
            }}
            onDelete={deleteCompletedDelivery}
            onEdit={(order) => {
              setEditingOrder(order);
            }}
          />
        ) : view === "closed-orders" ? (
          <ClosedOrdersPage
            key="closed-orders"
            orders={closedOrders}
            completedDeliveries={completedDeliveries}
            onBack={() => setView("dashboard")}
            onEdit={(order) => {
              setEditingOrder(order);
            }}
            onDelete={(orderId) => {
              const item = orders.find((o) => o.id === orderId);
              if (item)
                setTrash((prev) => [
                  ...prev,
                  {
                    id: Date.now().toString(),
                    type: "closedOrder",
                    item,
                    deletedAt: new Date().toISOString(),
                  },
                ]);
              setOrders((prev) => prev.filter((o) => o.id !== orderId));
              toast.success("Order deleted");
            }}
          />
        ) : view === "weekly-labour-report" ? (
          <WeeklyLabourReportPage
            key="weekly-labour-report"
            onBack={() => {
              const prev = navStackRef.current.pop() || "dashboard";
              setView(prev as View);
            }}
            completedDeliveries={completedDeliveries}
          />
        ) : view === "reports" ? (
          <ReportsPage
            key="reports"
            onBack={() => {
              const prev = navStackRef.current.pop() || "dashboard";
              setView(prev as View);
            }}
            completedDeliveries={completedDeliveries}
          />
        ) : view === "daily-labour-report" ? (
          <DailyLabourReportPage
            key="daily-labour-report"
            onBack={() => {
              const prev = navStackRef.current.pop() || "dashboard";
              setView(prev as View);
            }}
            completedDeliveries={completedDeliveries}
          />
        ) : view === "settings" ? (
          <SettingsPage
            key="settings"
            onBack={() => setView("dashboard")}
            trash={trash}
            setTrash={setTrash}
            lastBackupTime={lastBackupTime}
            setLastBackupTime={setLastBackupTime}
          />
        ) : (
          <DirectDeliveryPage
            key="direct-delivery"
            onBack={() => setView("dashboard")}
            onSaveComplete={(delivery) => {
              setCompletedDeliveries((prev) => [delivery, ...prev]);
              setView("dashboard");
            }}
          />
        )}
      </AnimatePresence>

      <EditOrderDialog
        order={editingOrder}
        onClose={() => setEditingOrder(null)}
        onSave={(updated) => {
          // Update in orders (for closed orders)
          setOrders((prev) =>
            prev.map((o) => (o.id === updated.id ? updated : o)),
          );
          // Update in completed deliveries
          setCompletedDeliveries((prev) =>
            prev.map((o) => (o.id === updated.id ? updated : o)),
          );
          setEditingOrder(null);
        }}
      />
      <Toaster position="bottom-center" />

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

export default App;
