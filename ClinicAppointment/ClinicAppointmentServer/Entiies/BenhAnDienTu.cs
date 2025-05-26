using System;
using System.Collections.Generic;

namespace ClinicAppointmentServer.Entiies;

public partial class BenhAnDienTu
{
    public int BenhAnId { get; set; }

    public int? LichHenId { get; set; }

    public int? BenhNhanId { get; set; }

    public DateOnly? NgayTao { get; set; }

    public string? ChuanDoan { get; set; }

    public string? HuongDieuTri { get; set; }

    public virtual BenhNhan? BenhNhan { get; set; }

    public virtual DatLichHen? LichHen { get; set; }
}
