using System;
using System.Collections.Generic;

namespace ClinicAppointmentServer.Entiies;

public partial class PhongKham
{
    public int PhongKhamId { get; set; }

    public string? TenPhong { get; set; }

    public int? GioiHanTiepNhan { get; set; }

    public virtual ICollection<DatLichHen> DatLichHens { get; set; } = new List<DatLichHen>();

    public virtual ICollection<ThongTinPhongKham> ThongTinPhongKhams { get; set; } = new List<ThongTinPhongKham>();
}
