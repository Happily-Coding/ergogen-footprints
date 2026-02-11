// Copyright (c) 2023 Marco Massarelli
//
// SPDX-License-Identifier: CC-BY-NC-SA-4.0
//
// To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/
//
// Authors: @ergogen + @infused-kim, @ceoloide, @grazfather, @nxtk improvements
//
// Description:
//    Virtual footprint for hotswap socket BOM/POS/3D preview only.
//    This footprint does NOT add any pads, holes, or silkscreen to the PCB.
//    It only provides:
//    - 3D model for the hotswap socket
//    - BOM entry for hotswap sockets
//    - POS file entry for hotswap sockets
//
//    This is useful for fabrication preview and BOM management when you want
//    to track hotswap sockets separately from the switch footprint.
//
// Nets:
//    from: corresponds to pin 1 (used only for reference, not added to PCB)
//    to: corresponds to pin 2 (used only for reference, not added to PCB)
//
// Params:
//    side: default is B for Back
//      the side on which to place the footprint reference, either F or B
//    model_filename: default is ''
//      Path to the 3D model STEP or WRL file for the hotswap socket
//      Use the ${VAR_NAME} syntax to point to a KiCad configured path
//    model_xyz_offset: default is [0, 0, 0]
//      xyz offset (in mm), used to adjust the position of the 3d model
//      relative the footprint
//    model_xyz_scale: default is [1, 1, 1]
//      xyz scale, used to adjust the size of the 3d model relative its
//      original size
//    model_xyz_rotation: default is [0, 0, 0]
//      xyz rotation (in degrees), used to adjust the orientation of the 3d
//      model relative the footprint
//    supplier_link: default is ''
//      URL link to the supplier page for hotswap sockets
//      this will be added as a KiCad property for BOM export
//    manufacturer_part_number: default is ''
//      Manufacturer part number for hotswap sockets
//      this will be added as a KiCad property for BOM export
//    do_not_populate: default is ''
//      Do Not Populate flag for hotswap sockets
//      Set to 'DNP' to indicate the manufacturer should not try to place the part automatically
//
// Notes:
// - This is a VIRTUAL footprint - it adds NOTHING to the actual PCB
// - No pads, holes, or silkscreen are generated
// - Only 3D model, BOM entry, and POS file entry are created
// - Use this alongside the actual switch footprint for BOM tracking

module.exports = {
  params: {
    designator: 'HS',
    side: 'B',
    model_filename: '',
    model_xyz_offset: [0, 0, 0],
    model_xyz_rotation: [0, 0, 0],
    model_xyz_scale: [1, 1, 1],
    supplier_link: '',
    manufacturer_part_number: '',
    do_not_populate: '',
    from: '',
    to: ''
  },
  body: p => {
    const footprint = `
  (footprint "ceoloide:hs-socket-fab-preview_choc_v1_v2"
    (layer "${p.side}.Cu")
    ${p.at}
    (property "Reference" "${p.ref}"
      (at 0 8.8 ${p.r})
      (layer "${p.side}.SilkS")
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (attr allow_soldermask_bridges)
    ${p.supplier_link ? `    (property "Hotswap Supplier Link" "${p.supplier_link}")` : ''}
    ${p.manufacturer_part_number ? `    (property "Hotswap manufacturer_part_number" "${p.manufacturer_part_number}")` : ''}
    ${p.do_not_populate ? `    (property "Hotswap Do Not Populate" "${p.do_not_populate}")` : ''}
    ${p.model_filename ? `
    (model ${p.model_filename}
      (offset (xyz ${p.model_xyz_offset[0]} ${p.model_xyz_offset[1]} ${p.model_xyz_offset[2]}))
      (scale (xyz ${p.model_xyz_scale[0]} ${p.model_xyz_scale[1]} ${p.model_xyz_scale[2]}))
      (rotate (xyz ${p.model_xyz_rotation[0]} ${p.model_xyz_rotation[1]} ${p.model_xyz_rotation[2]}))
    )
    ` : ''}
  )
    `

    return footprint
  }
}
