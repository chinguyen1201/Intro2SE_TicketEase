export default function Footer(){
  return (
    <footer className="footer">
      <div className="container grid">
        <div>
          <strong>Hotline</strong><br/>Thứ 2 – Chủ nhật (8:00 – 23:00)
          <p style={{marginTop:8}}>Email<br/>support@ticketease.vn</p>
          <p>Văn phòng chính<br/>227 Nguyễn Văn Cừ, Q5, TP.HCM</p>
        </div>
        <div>
          <strong>Dành cho khách hàng</strong>
          <p><a href="#">Điều khoản sử dụng</a></p>
          <p><a href="#">Chính sách bảo mật</a></p>
        </div>
        <div>
          <strong>Dành cho ban tổ chức</strong>
          <p><a href="#">Điều khoản dành cho BTC</a></p>
          <p><a href="#">Hỗ trợ xuất vé</a></p>
        </div>
        <div>
          <strong>Về chúng tôi</strong>
          <p><a href="#">Quy chế hoạt động</a></p>
          <p><a href="#">Phương thức thanh toán</a></p>
        </div>
      </div>
      <div className="container">
        <small>© 2025 Công ty TNHH TicketEase — Nền tảng quản lý & phân phối vé sự kiện hàng đầu Việt Nam</small>
      </div>
    </footer>
  )
}
