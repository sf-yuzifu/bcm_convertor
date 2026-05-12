#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TAURI_DIR="$PROJECT_ROOT/src-tauri"
DESKTOP_FILE="$TAURI_DIR/linux/moe.yzf.bcm-convertor.desktop"
ICONS_DIR="$TAURI_DIR/linux/icons"
RESOURCES_DIR="$TAURI_DIR"

PACKAGE_NAME="moe.yzf.bcm-convertor"
BINARY_NAME="bcm-convertor"
DISPLAY_NAME="编程猫格式工厂"
DESCRIPTION="将自己在kitten3/4上的作品快速制作成独立应用程序"
LONG_DESCRIPTION="将自己在kitten3/4上的作品快速制作成独立应用程序"
AUTHOR="小鱼yuzifu"
LICENSE="GPL-3.0"
HOMEPAGE="https://gitee.com/sf-yuzifu/bcm_convertor.git"
CATEGORY="Development"
DEPENDS="libwebkit2gtk-4.1-0, libgtk-3-0, libayatana-appindicator3-1"
ICON_NAME="moe.yzf.bcm-convertor"
ICON_SIZES=(16 24 32 48 64 128 256 512)

usage() {
  echo "Usage: $0 [--version VERSION] [--binary PATH] [--deb-only] [--rpm-only]"
  echo ""
  echo "Options:"
  echo "  --version VERSION    Package version (default: from tauri.conf.json)"
  echo "  --binary PATH        Path to the compiled binary (default: target/release/$BINARY_NAME)"
  echo "  --deb-only           Only build .deb package"
  echo "  --rpm-only           Only build .rpm package"
  echo "  --help               Show this help"
  exit 0
}

VERSION=""
BINARY_PATH=""
BUILD_DEB=true
BUILD_RPM=true

while [[ $# -gt 0 ]]; do
  case $1 in
    --version)
      VERSION="$2"
      shift 2
      ;;
    --binary)
      BINARY_PATH="$2"
      shift 2
      ;;
    --deb-only)
      BUILD_RPM=false
      shift
      ;;
    --rpm-only)
      BUILD_DEB=false
      shift
      ;;
    --help)
      usage
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

if [[ -z "$VERSION" ]]; then
  VERSION=$(node -e "console.log(require('$TAURI_DIR/tauri.conf.json').version)")
fi

if [[ -z "$BINARY_PATH" ]]; then
  BINARY_PATH="$TAURI_DIR/target/release/$BINARY_NAME"
fi

if [[ ! -f "$BINARY_PATH" ]]; then
  echo "Error: Binary not found at $BINARY_PATH"
  echo "Run 'cargo tauri build --bundles none' first, or specify with --binary"
  exit 1
fi

if [[ ! -f "$DESKTOP_FILE" ]]; then
  echo "Error: Desktop file not found at $DESKTOP_FILE"
  exit 1
fi

OUTPUT_DIR="$TAURI_DIR/target/release/bundle"
mkdir -p "$OUTPUT_DIR"

ARCH=$(uname -m)
case "$ARCH" in
  x86_64)  DEB_ARCH="amd64";   RPM_ARCH="x86_64" ;;
  aarch64) DEB_ARCH="arm64";   RPM_ARCH="aarch64" ;;
  *)       DEB_ARCH="$ARCH";   RPM_ARCH="$ARCH" ;;
esac

echo "========================================"
echo "  Package: $PACKAGE_NAME"
echo "  Version: $VERSION"
echo "  Arch:    $DEB_ARCH / $RPM_ARCH"
echo "  Binary:  $BINARY_PATH"
echo "========================================"
echo ""

install_icons() {
  local target_dir="$1"

  if [[ -d "$ICONS_DIR/scalable/apps" ]]; then
    local scalable_dir="$target_dir/share/icons/hicolor/scalable/apps"
    mkdir -p "$scalable_dir"
    cp "$ICONS_DIR/scalable/apps/$ICON_NAME.svg" "$scalable_dir/"
  fi

  for size in "${ICON_SIZES[@]}"; do
    local png="$ICONS_DIR/${size}x${size}/apps/$ICON_NAME.png"
    if [[ -f "$png" ]]; then
      local dir="$target_dir/share/icons/hicolor/${size}x${size}/apps"
      mkdir -p "$dir"
      cp "$png" "$dir/"
    fi
  done
}

if $BUILD_DEB; then
  echo ">>> Building .deb package..."

  DEB_NAME="${PACKAGE_NAME}_${VERSION}_${DEB_ARCH}"
  DEB_ROOT="$OUTPUT_DIR/$DEB_NAME"

  rm -rf "$DEB_ROOT"
  mkdir -p "$DEB_ROOT/DEBIAN"
  mkdir -p "$DEB_ROOT/usr/bin"
  mkdir -p "$DEB_ROOT/usr/share/applications"
  mkdir -p "$DEB_ROOT/usr/share/doc/$PACKAGE_NAME"

  cp "$BINARY_PATH" "$DEB_ROOT/usr/bin/$BINARY_NAME"
  chmod 755 "$DEB_ROOT/usr/bin/$BINARY_NAME"

  cp "$DESKTOP_FILE" "$DEB_ROOT/usr/share/applications/$PACKAGE_NAME.desktop"
  chmod 644 "$DEB_ROOT/usr/share/applications/$PACKAGE_NAME.desktop"

  install_icons "$DEB_ROOT"

  INSTALLED_SIZE=$(du -sk "$DEB_ROOT/usr" | cut -f1)

  cat > "$DEB_ROOT/DEBIAN/control" << EOF
Package: $PACKAGE_NAME
Version: $VERSION
Architecture: $DEB_ARCH
Maintainer: $AUTHOR
Installed-Size: $INSTALLED_SIZE
Priority: optional
Section: utils
Depends: $DEPENDS
Homepage: $HOMEPAGE
Description: $DESCRIPTION
 $LONG_DESCRIPTION
EOF

  DEB_OUTPUT="$OUTPUT_DIR/${DEB_NAME}.deb"
  dpkg-deb --root-owner-group --build "$DEB_ROOT" "$DEB_OUTPUT"
  rm -rf "$DEB_ROOT"
  echo ">>> .deb created: $DEB_OUTPUT"
  echo ""
fi

if $BUILD_RPM; then
  echo ">>> Building .rpm package..."

  if ! command -v rpmbuild &>/dev/null; then
    echo "Warning: rpmbuild not found, skipping .rpm package."
    echo "Install with: sudo apt install rpm (Debian/Ubuntu) or sudo dnf install rpm-build (Fedora)"
    echo ""
  else
    RPM_TOPDIR="$OUTPUT_DIR/rpmbuild"
    rm -rf "$RPM_TOPDIR"
    mkdir -p "$RPM_TOPDIR"/{BUILD,RPMS,SOURCES,SPECS,SRPMS}

    cat > "$RPM_TOPDIR/SPECS/$PACKAGE_NAME.spec" << EOF
Name:           $PACKAGE_NAME
Version:        $VERSION
Release:        1
Summary:        $DESCRIPTION
License:        $LICENSE
URL:            $HOMEPAGE
BuildArch:      $RPM_ARCH

%description
$LONG_DESCRIPTION

%install
rm -rf %{buildroot}
mkdir -p %{buildroot}/usr/bin
mkdir -p %{buildroot}/usr/share/applications
mkdir -p %{buildroot}/usr/share/icons/hicolor/scalable/apps
mkdir -p %{buildroot}/usr/share/doc/$PACKAGE_NAME

install -m 755 $BINARY_PATH %{buildroot}/usr/bin/$BINARY_NAME
install -m 644 $DESKTOP_FILE %{buildroot}/usr/share/applications/$PACKAGE_NAME.desktop

$(if [[ -d "$ICONS_DIR/scalable/apps" ]]; then
  echo "install -m 644 $ICONS_DIR/scalable/apps/$ICON_NAME.svg %{buildroot}/usr/share/icons/hicolor/scalable/apps/$ICON_NAME.svg"
fi)

$(for size in "${ICON_SIZES[@]}"; do
  png="$ICONS_DIR/${size}x${size}/apps/$ICON_NAME.png"
  if [[ -f "$png" ]]; then
    echo "mkdir -p %{buildroot}/usr/share/icons/hicolor/${size}x${size}/apps"
    echo "install -m 644 $png %{buildroot}/usr/share/icons/hicolor/${size}x${size}/apps/$ICON_NAME.png"
  fi
done)

%files
/usr/bin/$BINARY_NAME
/usr/share/applications/$PACKAGE_NAME.desktop
/usr/share/icons/hicolor/scalable/apps/$ICON_NAME.svg
$(for size in "${ICON_SIZES[@]}"; do
  png="$ICONS_DIR/${size}x${size}/apps/$ICON_NAME.png"
  if [[ -f "$png" ]]; then
    echo "/usr/share/icons/hicolor/${size}x${size}/apps/$ICON_NAME.png"
  fi
done)

%post
/usr/bin/update-icon-caches /usr/share/icons/hicolor 2>/dev/null || true
update-desktop-database /usr/share/applications 2>/dev/null || true

%postun
/usr/bin/update-icon-caches /usr/share/icons/hicolor 2>/dev/null || true
update-desktop-database /usr/share/applications 2>/dev/null || true
EOF

    rpmbuild -bb \
      --define "_topdir $RPM_TOPDIR" \
      --target "$RPM_ARCH" \
      "$RPM_TOPDIR/SPECS/$PACKAGE_NAME.spec"

    RPM_FILE=$(find "$RPM_TOPDIR/RPMS" -name "*.rpm" -type f | head -1)
    if [[ -n "$RPM_FILE" ]]; then
      mv "$RPM_FILE" "$OUTPUT_DIR/"
      echo ">>> .rpm created: $OUTPUT_DIR/$(basename "$RPM_FILE")"
    fi
    rm -rf "$RPM_TOPDIR"
    echo ""
  fi
fi

echo "Done."
