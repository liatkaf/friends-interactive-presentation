// Original CSS/SVG character illustrations retained from v0.4.
function portrait(i) {
  const hair = ["#241b21", "#845233", "#ddba69", "#2d2424", "#4e342d", "#291f20"][i];
  const shirt = ["#952e35", "#5c796a", "#9b6281", "#484966", "#b88342", "#83533e"][i];
  const longHair = i < 3;
  return `<svg viewBox="0 0 200 170" aria-hidden="true"><circle cx="100" cy="78" r="64" fill="#fff3d6" opacity=".17"/><path d="M33 178 Q30 121 78 120 H122 Q170 122 168 178" fill="${shirt}"/><path d="M85 110 V129 Q100 142 115 129 V110" fill="#ca906f"/>${longHair ? `<path d="M54 76 Q47 17 98 17 Q151 16 148 80 L158 139 L118 132 L78 136 L47 141Z" fill="${hair}"/>` : ""}<ellipse cx="100" cy="79" rx="34" ry="44" fill="#e4b28a"/><path d="M65 74 Q48 27 90 24 Q139 12 140 69 Q110 59 102 42 Q86 64 65 74" fill="${hair}"/><path d="M78 82h9m26 0h9" stroke="#402b29" stroke-width="3" stroke-linecap="round"/><path d="M93 105q8 6 15-1" fill="none" stroke="#9c5346" stroke-width="2"/>${i===2 ? '<circle cx="62" cy="99" r="6" fill="none" stroke="#f4c542" stroke-width="3"/><circle cx="138" cy="99" r="6" fill="none" stroke="#f4c542" stroke-width="3"/>' : ""}${i===4 ? '<path d="M80 134l20 28 20-28" fill="#eee0c4"/>' : ""}</svg>`;
}
