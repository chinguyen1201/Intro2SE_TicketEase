// frontend/src/features/organizer/pages/CreateEventPage.jsx
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarLoggedIn from "../../../components/NavbarLoggedIn";
import { RiTicket2Line } from "react-icons/ri";
import { TbPlus, TbTag, TbTrash } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";


export default function CreateEventPage() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  // ---------- Step 1: Basic Info ----------
  const [basic, setBasic] = useState({
    posterFile: null,
    posterPreview: null,
    title: "",
    modeOnline: false,
    modeOffline: false,
    venueName: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    date: "",
    time: "",
    category: "",
    description: "",
    orgLogo: null,
    orgLogoPreview: null,
    orgName: "",
    orgInfo: "",
  });

  // ---------- Step 2: Tickets ----------
  const [tickets, setTickets] = useState([
    {
      id: crypto.randomUUID(),
      name: "Phụ thu Tân Định",
      price: "",
      quantity: "",
      desc: "",
      start: "",
      end: "",
      editing: true,
    },
  ]);

  // ---------- Step 3: Payout ----------
  const [payout, setPayout] = useState({
    owner: "",
    account: "",
    bank: "",
    businessType: "",
    taxCode: "",
  });

  const [showSubmitted, setShowSubmitted] = useState(false);

  const next = () => setStep((s) => Math.min(3, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  // Add a local handleSubmit that just shows the overlay
  const handleSubmit = () => {
    setShowSubmitted(true);
  };
  // Add a handler for saving draft
  const handleSaveDraft = () => {
    // Validate required fields for draft (e.g., title, description, date, time, category)
    if (!basic.title || !basic.description || !basic.date || !basic.time || !basic.category) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc để lưu nháp.');
      return;
    }
    // Build draft event object
    const draftEvent = {
      id: Date.now().toString(),
      title: basic.title,
      description: basic.description,
      date: basic.date,
      time: basic.time,
      category: basic.category,
      venue: basic.venueName,
      address: `${basic.address}, ${basic.ward}, ${basic.district}, ${basic.province}`,
      status: 'draft',
      tickets,
      payout,
      img: basic.posterPreview || '',
      originalStatus: 'draft',
    };
    // Save to localStorage (append to existing drafts)
    const drafts = JSON.parse(localStorage.getItem('draftEvents') || '[]');
    drafts.push(draftEvent);
    localStorage.setItem('draftEvents', JSON.stringify(drafts));
    // Navigate to event list page
    navigate('/eventlist');
  };


  return (
    <>
      <NavbarLoggedIn />
      <div className="min-h-screen bg-[#232222] text-white">
        {/* Breadcrumb */}
        <div className="bg-black/70">
          <div className="max-w-6xl mx-auto px-6 py-3 text-sm">
            <span className="text-white/80">Trang chủ</span>
            <span className="mx-2 text-white/40">›</span>
            <span className="font-medium">Tạo sự kiện mới</span>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Stepper step={step} setStep={setStep} />
          {step === 1 && (
            <StepBasic 
              basic={basic} 
              setBasic={setBasic} 
              onNext={next} 
              onSaveDraft={handleSaveDraft} // <-- pass handler
            />
          )}
          {step === 2 && (
            <StepTickets
              tickets={tickets}
              setTickets={setTickets}
              onNext={next}
              onBack={back}
              basic={basic}
              onSaveDraft={handleSaveDraft} // <-- pass handler
            />
          )}
          {step === 3 && (
            <StepPayout
              payout={payout}
              setPayout={setPayout}
              onBack={back}
              handleSubmit={handleSubmit}
              onSaveDraft={handleSaveDraft} // <-- pass handler
            />
          )}
        </div>
      </div>
      {/* Success overlays */}
      {showSubmitted && <SubmittedOverlay onClose={() => setShowSubmitted(false)} />}
    </>
  );
}

/* ----------------- Small components ----------------- */
function Stepper({ step, setStep }) {
  const items = [
    { id: 1, label: "Thông tin cơ bản" },
    { id: 2, label: "Thông tin vé" },
    { id: 3, label: "Thông tin thanh toán" },
  ];
  return (
    <div className="max-w-3xl mx-auto mb-6">
      <div className="bg-white rounded-full p-1 grid grid-cols-3 gap-2">
        {items.map((it) => {
          const active = step === it.id;
          return (
            <button
              key={it.id}
              className={`rounded-full py-2 text-sm font-medium transition ${
                active ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setStep(it.id)}
            >
              {it.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* -------- Step 1: Basic information -------- */
function StepBasic({ basic, setBasic, onNext, onSaveDraft }) {
  const posterInput = useRef(null);
  const orgLogoInput = useRef(null);

  const handleFileChange = (field, previewField) => (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBasic(b => ({ ...b, [field]: file }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setBasic(b => ({ ...b, [previewField]: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const dropCard = (label, ref, file, preview) => (
    <div
      className="h-40 md:h-48 bg-gray-300/60 rounded-lg grid place-items-center text-center text-gray-700 cursor-pointer relative overflow-hidden"
      onClick={() => ref.current?.click()}
    >
      {preview ? (
        <img 
          src={preview} 
          alt={`${label} preview`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div>
          <div className="text-4xl mb-1">⬆</div>
          <div className="text-sm mb-2">Tải lên {label.toLowerCase()}</div>
          <button className="px-3 py-1 bg-white rounded">Chọn file</button>
        </div>
      )}
      <input
        type="file"
        className="hidden"
        ref={ref}
        accept="image/*"
        onChange={handleFileChange(file, `${file.replace('File', '')}Preview`)}
      />
      {preview && (
        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="px-3 py-1 bg-white rounded text-black text-sm">
            Đổi ảnh
          </button>
        </div>
      )}
    </div>
  );

  const input = (props) => (
    <input
      {...props}
      className={`w-full bg-white text-black rounded-md px-3 py-2 outline-none ${
        props.disabled 
          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
          : ''
      } ${props.className || ""}`}
    />
  );

  return (
    <>
      {/* Poster */}
      <div>
        <div className="text-sm mb-2">Poster sự kiện</div>
        {dropCard("Poster sự kiện", posterInput, "posterFile", basic.posterPreview)}
      </div>

      {/* Title */}
      <div className="mt-5">
        <div className="text-sm mb-2">Tên sự kiện</div>
        {input({
          placeholder: "Nhập tên sự kiện",
          value: basic.title,
          onChange: (e) => setBasic((b) => ({ ...b, title: e.target.value })),
        })}
      </div>

      {/* Mode */}
      <div className="mt-5">
        <div className="text-sm mb-2">Hình thức sự kiện</div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={basic.modeOnline}
              onChange={(e) => {
                const isOnline = e.target.checked;
                setBasic((b) => {
                  // If switching to online-only, clear location fields
                  if (isOnline && !b.modeOffline) {
                    return {
                      ...b,
                      modeOnline: isOnline,
                      venueName: "",
                      province: "",
                      district: "",
                      ward: "",
                      address: ""
                    };
                  }
                  return { ...b, modeOnline: isOnline };
                });
              }}
            />
            Online
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={basic.modeOffline}
              onChange={(e) => setBasic((b) => ({ ...b, modeOffline: e.target.checked }))}
            />
            Offline
          </label>
          {basic.modeOnline && !basic.modeOffline && (
            <div className="text-xs text-yellow-300 mt-2">
              💡 Sự kiện online - các trường địa điểm sẽ bị vô hiệu hóa
            </div>
          )}
        </div>
      </div>

      {/* Venue name */}
      <div className="mt-5">
        <div className="text-sm mb-2">Tên địa điểm</div>
        {input({
          placeholder: "Nhập tên địa điểm",
          value: basic.venueName,
          onChange: (e) => setBasic((b) => ({ ...b, venueName: e.target.value })),
          disabled: basic.modeOnline && !basic.modeOffline,
          className: basic.modeOnline && !basic.modeOffline ? "opacity-50 cursor-not-allowed" : "",
        })}
      </div>

      {/* Address grid */}
      <div className="mt-5 grid md:grid-cols-2 gap-4">
        <div>
          <div className="text-sm mb-2">Tỉnh/Thành</div>
          {input({
            value: basic.province,
            onChange: (e) => setBasic((b) => ({ ...b, province: e.target.value })),
            disabled: basic.modeOnline && !basic.modeOffline,
            className: basic.modeOnline && !basic.modeOffline ? "opacity-50 cursor-not-allowed" : "",
          })}
        </div>
        <div>
          <div className="text-sm mb-2">Quận/Huyện</div>
          {input({
            value: basic.district,
            onChange: (e) => setBasic((b) => ({ ...b, district: e.target.value })),
            disabled: basic.modeOnline && !basic.modeOffline,
            className: basic.modeOnline && !basic.modeOffline ? "opacity-50 cursor-not-allowed" : "",
          })}
        </div>
        <div>
          <div className="text-sm mb-2">Phường/Xã</div>
          {input({
            value: basic.ward,
            onChange: (e) => setBasic((b) => ({ ...b, ward: e.target.value })),
            disabled: basic.modeOnline && !basic.modeOffline,
            className: basic.modeOnline && !basic.modeOffline ? "opacity-50 cursor-not-allowed" : "",
          })}
        </div>
        <div>
          <div className="text-sm mb-2">Số nhà, đường</div>
          {input({
            value: basic.address,
            onChange: (e) => setBasic((b) => ({ ...b, address: e.target.value })),
            disabled: basic.modeOnline && !basic.modeOffline,
            className: basic.modeOnline && !basic.modeOffline ? "opacity-50 cursor-not-allowed" : "",
          })}
        </div>
      </div>

      {/* Category */}
      <div className="mt-5">
        <div className="text-sm mb-2">Thể loại sự kiện</div>
        <select
          className="w-full bg-white text-black rounded-md px-3 py-2 outline-none"
          value={basic.category}
          onChange={(e) => setBasic((b) => ({ ...b, category: e.target.value }))}
        >
          <option value="">Chọn thể loại</option>
          <option>Nhạc sống</option>
          <option>Hội thảo</option>
          <option>Thể thao</option>
          <option>Nghệ thuật</option>
        </select>
      </div>

      {/* Date and Time */}
      <div className="mt-5 grid md:grid-cols-2 gap-4">
        <div>
          <div className="text-sm mb-2">Ngày tổ chức *</div>
          {input({
            type: "date",
            value: basic.date,
            onChange: (e) => setBasic((b) => ({ ...b, date: e.target.value })),
          })}
        </div>
        <div>
          <div className="text-sm mb-2">Giờ tổ chức *</div>
          {input({
            type: "time",
            value: basic.time,
            onChange: (e) => setBasic((b) => ({ ...b, time: e.target.value })),
          })}
        </div>
      </div>

      {/* Description */}
      <div className="mt-5">
        <div className="text-sm mb-2">Mô tả sự kiện</div>
        <textarea
          rows={6}
          className="w-full bg-white text-black rounded-md px-3 py-2 outline-none"
          value={basic.description}
          onChange={(e) => setBasic((b) => ({ ...b, description: e.target.value }))}
        />
      </div>

      {/* Organizer block */}
      <div className="mt-5 grid md:grid-cols-2 gap-4">
        <div>
          <div className="text-sm mb-2">Logo ban tổ chức</div>
          {dropCard("logo", orgLogoInput, "orgLogo", basic.orgLogoPreview)}
        </div>
        <div className="space-y-4">
          <div>
            <div className="text-sm mb-2">Tên ban tổ chức</div>
            {input({
              value: basic.orgName,
              onChange: (e) => setBasic((b) => ({ ...b, orgName: e.target.value })),
            })}
          </div>
          <div>
            <div className="text-sm mb-2">Thông tin ban tổ chức</div>
            {input({
              value: basic.orgInfo,
              onChange: (e) => setBasic((b) => ({ ...b, orgInfo: e.target.value })),
            })}
          </div>
        </div>
      </div>

      {/* Next */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={onSaveDraft}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md font-semibold text-white"
        >
          Lưu nháp
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-md font-semibold"
        >
          Tiếp tục &gt;&gt;
        </button>
      </div>
    </>
  );
}

/* -------- Step 2: Tickets -------- */
function StepTickets({ tickets, setTickets, onNext, onBack, basic, onSaveDraft }) {
  const addTicket = () =>
    setTickets((t) => [
      ...t,
      {
        id: crypto.randomUUID(),
        name: "Loại vé mới",
        price: "",
        quantity: "",
        desc: "",
        start: "",
        end: "",
        editing: true,
      },
    ]);

  const updateById = (id, patch) =>
    setTickets((arr) => arr.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const removeById = (id) => setTickets((arr) => arr.filter((x) => x.id !== id));

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div />
        <button
          onClick={addTicket}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-black/70 text-white border border-white/20 hover:bg-black/60"
        >
          <TbPlus />
          Thêm loại vé
        </button>
      </div>

      <div className="space-y-5">
        {tickets.map((t) => (
          <div key={t.id}>
            <div className="inline-flex items-center gap-2 bg-black text-white rounded-md px-3 py-1.5">
              <RiTicket2Line />
              <span className="font-semibold">{t.name}</span>
              <span className="ml-3 text-emerald-400">
                <TbTag />
              </span>
              <button
                className="ml-1 text-red-400 hover:text-red-300"
                onClick={() => removeById(t.id)}
                title="Xóa"
              >
                <TbTrash />
              </button>
            </div>

            {t.editing && (
              <div className="mt-3 bg-black rounded-2xl p-5 shadow-sm relative max-w-3xl">
                <button
                  title="Đóng"
                  onClick={() => updateById(t.id, { editing: false })}
                  className="absolute right-3 top-3 text-white/70 hover:text-white"
                >
                  <RxCross2 />
                </button>

                <div className="grid gap-4">
                  <Field label="Tên vé">
                    <input
                      value={t.name}
                      onChange={(e) => updateById(t.id, { name: e.target.value })}
                      className="w-full bg-white text-black rounded-md px-3 py-2 outline-none"
                    />
                  </Field>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Field label="Giá vé">
                      <input
                        type="number"
                        value={t.price}
                        onChange={(e) => updateById(t.id, { price: e.target.value })}
                        className="w-full bg-white text-black rounded-md px-3 py-2 outline-none"
                      />
                    </Field>
                    <Field label="Tổng số lượng vé">
                      <input
                        type="number"
                        value={t.quantity}
                        onChange={(e) => updateById(t.id, { quantity: e.target.value })}
                        className="w-full bg-white text-black rounded-md px-3 py-2 outline-none"
                      />
                    </Field>
                  </div>

                  <Field label="Mô tả vé">
                    <textarea
                      rows={4}
                      value={t.desc}
                      onChange={(e) => updateById(t.id, { desc: e.target.value })}
                      className="w-full bg-white text-black rounded-md px-3 py-2 outline-none"
                    />
                  </Field>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Field label="Bắt đầu bán">
                      <input
                        type="datetime-local"
                        value={t.start}
                        onChange={(e) => updateById(t.id, { start: e.target.value })}
                        className="w-full bg-white text-black rounded-md px-3 py-2 outline-none"
                      />
                    </Field>
                    <Field label="Kết thúc bán">
                      <input
                        type="datetime-local"
                        value={t.end}
                        onChange={(e) => updateById(t.id, { end: e.target.value })}
                        className="w-full bg-white text-black rounded-md px-3 py-2 outline-none"
                      />
                    </Field>
                  </div>

                  <button
                    onClick={() => updateById(t.id, { editing: false })}
                    className="mt-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-md"
                  >
                    Lưu
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <div className="flex gap-2">
          <button onClick={onBack} className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20">
            Quay lại
          </button>
          <button
            onClick={onSaveDraft}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md font-semibold text-white"
          >
            Lưu nháp
          </button>
        </div>
        <button onClick={onNext} className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-md font-semibold">
          Tiếp tục &gt;&gt;
        </button>
      </div>
    </>
  );
}

/* -------- Step 3: Payout -------- */
function StepPayout({ payout, setPayout, onBack, handleSubmit, onSaveDraft }) {
  const input = (props) => (
    <input
      {...props}
      className={`w-full bg-white text-black rounded-md px-3 py-2 outline-none ${props.className || ""}`}
    />
  );

  return (
    <>
      <div className="max-w-3xl mx-auto bg-black rounded-2xl p-6 border border-white/10">
        <div className="text-white/90 mb-4">
          TicketEase sẽ chuyển tiền bán vé đến tài khoản ngân hàng của bạn.
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-sm mb-2">Chủ tài khoản</div>
            {input({
              value: payout.owner,
              onChange: (e) => setPayout((p) => ({ ...p, owner: e.target.value })),
            })}
          </div>

          <div>
            <div className="text-sm mb-2">Số tài khoản</div>
            {input({
              value: payout.account,
              onChange: (e) => setPayout((p) => ({ ...p, account: e.target.value })),
            })}
          </div>

          <div>
            <div className="text-sm mb-2">Tên ngân hàng</div>
            <select
              className="w-full bg-white text-black rounded-md px-3 py-2 outline-none"
              value={payout.bank}
              onChange={(e) => setPayout((p) => ({ ...p, bank: e.target.value }))}
            >
              <option value="">Chọn ngân hàng</option>
              <option>Vietcombank</option>
              <option>VietinBank</option>
              <option>Techcombank</option>
              <option>ACB</option>
            </select>
          </div>

          <div>
            <div className="text-sm mb-2">Loại hình kinh doanh</div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={payout.businessType === "personal"}
                  onChange={() => setPayout((p) => ({ ...p, businessType: "personal" }))}
                />
                Cá nhân
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={payout.businessType === "org"}
                  onChange={() => setPayout((p) => ({ ...p, businessType: "org" }))}
                />
                Doanh nghiệp/Tổ chức
              </label>
            </div>
          </div>

          <div>
            <div className="text-sm mb-2">Mã số thuế</div>
            {input({
              value: payout.taxCode,
              onChange: (e) => setPayout((p) => ({ ...p, taxCode: e.target.value })),
            })}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <div className="flex gap-2">
          <button 
            onClick={onBack} 
            className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20"
          >
            Quay lại
          </button>
          <button
            onClick={onSaveDraft}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md font-semibold text-white"
          >
            Lưu nháp
          </button>
        </div>
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-md font-semibold flex items-center gap-2"
        >
          Gửi để duyệt
        </button>
      </div>
    </>
  );
}

/* -------- Success Overlay -------- */
function SubmittedOverlay({ onClose }) {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-[460px] p-6 text-center">
        <div className="text-emerald-600 font-semibold text-lg">
          Sự kiện đã được gửi để duyệt!
        </div>
        <div className="text-black/70 mt-2 mb-5">
          Kết quả sẽ được thông báo qua email trong vòng 24-48 giờ.
        </div>
        <button
          onClick={() => navigate("/")}
          className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-md"
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );
}

/* -------- Draft Saved Overlay -------- */
function DraftSavedOverlay({ onClose }) {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-[460px] p-6 text-center">
        <div className="text-blue-600 font-semibold text-lg">
          Sự kiện đã được lưu dưới dạng nháp!
        </div>
        <div className="text-black/70 mt-2 mb-5">
          Bạn có thể tiếp tục chỉnh sửa và gửi để duyệt bất kỳ lúc nào.
        </div>
        <div className="flex gap-2 justify-center">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-md"
          >
            Tiếp tục chỉnh sửa
          </button>
          <button
            onClick={() => navigate("/eventlist")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md"
          >
            Xem danh sách sự kiện
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------- helpers -------- */
function Field({ label, children }) {
  return (
    <label className="block">
      <div className="text-sm mb-2">{label}</div>
      {children}
    </label>
  );
}
