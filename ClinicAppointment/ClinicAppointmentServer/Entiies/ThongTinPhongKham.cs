using System;
using System.Collections.Generic;

namespace ClinicAppointmentServer.Entiies;

public partial class ThongTinPhongKham
{
    public int ThongTinPhongKhamId { get; set; }

    public int? PhongKhamId { get; set; }

    public DateOnly? Ngay { get; set; }

    public bool? Status { get; set; }

    public int? Hen { get; set; }

    public int? DangKy { get; set; }

    public int? Kham { get; set; }

    public virtual PhongKham? PhongKham { get; set; }
}
