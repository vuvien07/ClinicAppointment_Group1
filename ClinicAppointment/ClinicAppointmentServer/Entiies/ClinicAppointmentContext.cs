using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace ClinicAppointmentServer.Entiies;

public partial class ClinicAppointmentContext : DbContext
{
    public ClinicAppointmentContext()
    {
    }

    public ClinicAppointmentContext(DbContextOptions<ClinicAppointmentContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Account> Accounts { get; set; }

    public virtual DbSet<BenhAnDienTu> BenhAnDienTus { get; set; }

    public virtual DbSet<BenhNhan> BenhNhans { get; set; }

    public virtual DbSet<DatLichHen> DatLichHens { get; set; }

    public virtual DbSet<PhongKham> PhongKhams { get; set; }

    public virtual DbSet<ThongTinPhongKham> ThongTinPhongKhams { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("server =localhost;database=EXE201;uid=sa;pwd=123;TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Account>(entity =>
        {
            entity.HasKey(e => e.AccountId).HasName("PK__Account__349DA58661C23312");

            entity.ToTable("Account");

            entity.HasIndex(e => e.TenDangNhap, "UQ__Account__55F68FC0954CF70E").IsUnique();

            entity.Property(e => e.AccountId).HasColumnName("AccountID");
            entity.Property(e => e.MatKhau).HasMaxLength(255);
            entity.Property(e => e.TenDangNhap).HasMaxLength(50);
            entity.Property(e => e.VaiTro).HasMaxLength(50);
        });

        modelBuilder.Entity<BenhAnDienTu>(entity =>
        {
            entity.HasKey(e => e.BenhAnId).HasName("PK__BenhAnDi__C696C1320DD3F168");

            entity.ToTable("BenhAnDienTu");

            entity.Property(e => e.BenhAnId).HasColumnName("BenhAnID");
            entity.Property(e => e.BenhNhanId).HasColumnName("BenhNhanID");
            entity.Property(e => e.LichHenId).HasColumnName("LichHenID");
            entity.Property(e => e.NgayTao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.BenhNhan).WithMany(p => p.BenhAnDienTus)
                .HasForeignKey(d => d.BenhNhanId)
                .HasConstraintName("FK__BenhAnDie__BenhN__5812160E");

            entity.HasOne(d => d.LichHen).WithMany(p => p.BenhAnDienTus)
                .HasForeignKey(d => d.LichHenId)
                .HasConstraintName("FK__BenhAnDie__LichH__571DF1D5");
        });

        modelBuilder.Entity<BenhNhan>(entity =>
        {
            entity.HasKey(e => e.BenhNhanId).HasName("PK__BenhNhan__151050A6CEDD19C2");

            entity.ToTable("BenhNhan");

            entity.Property(e => e.BenhNhanId).HasColumnName("BenhNhanID");
            entity.Property(e => e.Cccd).HasMaxLength(250);
            entity.Property(e => e.DanToc).HasMaxLength(250);
            entity.Property(e => e.DiaChi).HasMaxLength(250);
            entity.Property(e => e.GioiTinh).HasMaxLength(10);
            entity.Property(e => e.HovaTen).HasMaxLength(250);
            entity.Property(e => e.NgheNghiep).HasMaxLength(250);
            entity.Property(e => e.SoDienThoai).HasMaxLength(250);
        });

        modelBuilder.Entity<DatLichHen>(entity =>
        {
            entity.HasKey(e => e.LichHenId).HasName("PK__DatLichH__F92991B6F993CC25");

            entity.ToTable("DatLichHen");

            entity.Property(e => e.LichHenId).HasColumnName("LichHenID");
            entity.Property(e => e.BenhNhanId).HasColumnName("BenhNhanID");
            entity.Property(e => e.Gio).HasMaxLength(10);
            entity.Property(e => e.LyDoKham).HasMaxLength(255);
            entity.Property(e => e.PhongKhamId).HasColumnName("PhongKhamID");

            entity.HasOne(d => d.BenhNhan).WithMany(p => p.DatLichHens)
                .HasForeignKey(d => d.BenhNhanId)
                .HasConstraintName("FK__DatLichHe__BenhN__534D60F1");

            entity.HasOne(d => d.PhongKham).WithMany(p => p.DatLichHens)
                .HasForeignKey(d => d.PhongKhamId)
                .HasConstraintName("FK__DatLichHe__Phong__5441852A");
        });

        modelBuilder.Entity<PhongKham>(entity =>
        {
            entity.HasKey(e => e.PhongKhamId).HasName("PK__PhongKha__33E1EFBB7FCB4098");

            entity.ToTable("PhongKham");

            entity.Property(e => e.PhongKhamId).HasColumnName("PhongKhamID");
            entity.Property(e => e.TenPhong).HasMaxLength(100);
        });

        modelBuilder.Entity<ThongTinPhongKham>(entity =>
        {
            entity.HasKey(e => e.ThongTinPhongKhamId).HasName("PK__ThongTin__7F248A6BBE68AA60");

            entity.ToTable("ThongTinPhongKham");

            entity.Property(e => e.ThongTinPhongKhamId).HasColumnName("ThongTinPhongKhamID");
            entity.Property(e => e.PhongKhamId).HasColumnName("PhongKhamID");

            entity.HasOne(d => d.PhongKham).WithMany(p => p.ThongTinPhongKhams)
                .HasForeignKey(d => d.PhongKhamId)
                .HasConstraintName("FK__ThongTinP__Phong__5070F446");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
