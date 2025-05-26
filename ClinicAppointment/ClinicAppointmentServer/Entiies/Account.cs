using System;
using System.Collections.Generic;

namespace ClinicAppointmentServer.Entiies;

public partial class Account
{
    public int AccountId { get; set; }

    public string? TenDangNhap { get; set; }

    public string? MatKhau { get; set; }

    public string? VaiTro { get; set; }
}
