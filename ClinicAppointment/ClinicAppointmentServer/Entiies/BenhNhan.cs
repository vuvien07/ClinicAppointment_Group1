using System;
using System.Collections.Generic;

namespace ClinicAppointmentServer.Entiies;

public partial class BenhNhan
{
    public int BenhNhanId { get; set; }

    public string? HovaTen { get; set; }

    public string? GioiTinh { get; set; }

    public DateOnly? NgaySinh { get; set; }

    public string? SoDienThoai { get; set; }

    public string? DiaChi { get; set; }

    public string? Cccd { get; set; }

    public string? NgheNghiep { get; set; }

    public string? DanToc { get; set; }

    public string? QuocTich { get; set; }

    public virtual ICollection<BenhAnDienTu> BenhAnDienTus { get; set; } = new List<BenhAnDienTu>();

    public virtual ICollection<DatLichHen> DatLichHens { get; set; } = new List<DatLichHen>();
}
