using System;
using System.Collections.Generic;

namespace ClinicAppointmentServer.Entiies;

public partial class GhiAm
{
    public int GhiAmId { get; set; }

    public string? CuocGoiId { get; set; }

    public string? TrangThaiCuocGoi { get; set; }

    public string? SoNguoiGoi { get; set; }

    public string? SoNguoiNghe { get; set; }

    public string? SoDauCuoi { get; set; }

    public string? ThoiGianBatDau { get; set; }

    public string? ThoiGianKetThuc { get; set; }

    public string? TongThoiLuong { get; set; }

    public string? UrlGhiAm { get; set; }

    public string? Huong { get; set; }

    public string? UrlPhatGhiAm { get; set; }

    public bool? IsBotCall { get; set; }
}
