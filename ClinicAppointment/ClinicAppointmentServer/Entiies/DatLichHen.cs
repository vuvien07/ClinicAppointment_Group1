using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicAppointmentServer.Entiies;

public partial class DatLichHen
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
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
