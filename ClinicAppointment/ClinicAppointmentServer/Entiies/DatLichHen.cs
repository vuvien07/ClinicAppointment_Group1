using System;
using System.Collections.Generic;

namespace ClinicAppointmentServer.Entiies;

public partial class DatLichHen
{
    public int LichHenId { get; set; }

    public int? BenhNhanId { get; set; }

    public int? PhongKhamId { get; set; }

    public DateOnly? Ngay { get; set; }

    public string? Gio { get; set; }

    public string? LyDoKham { get; set; }

    public string? GhiAmText { get; set; }

    public virtual ICollection<BenhAnDienTu> BenhAnDienTus { get; set; } = new List<BenhAnDienTu>();

    public virtual BenhNhan? BenhNhan { get; set; }

    public virtual PhongKham? PhongKham { get; set; }
}
