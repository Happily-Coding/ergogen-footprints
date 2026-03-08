// Copyright (c) 2023 Marco Massarelli
//
// SPDX-License-Identifier: CC-BY-NC-SA-4.0
//
// To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/
//
// Authors: @ceoloide
//
// Description:
//    Virtual footprint for nice!nano pin header BOM/POS/3D preview only.
//    This footprint does NOT add any pads, holes, or silkscreen to the PCB.
//    It only provides:
//    - 3D model for the pin header
//    - BOM entry for pin headers
//    - POS file entry for pin headers
//
//    This is useful for fabrication preview and BOM management when you want
//    to track pin headers separately from the MCU footprint.
//
// Params:
//    side: default is B for Back (where nice!nano is typically mounted)
//      the side on which to place the footprint reference, either F or B
//    include_silkscreen: default is false
//      if true, will include the reference designator on silkscreen
//    pin_count: default is 12
//      Number of pins in the header (used for reference)
//    pitch: default is 2.54
//      Pin pitch in mm (standard is 2.54mm)
//    model_filename: default is '' (auto-selected)
//      Path to the 3D model STEP, WRL, or STL file for the pin header
//      Use the ${VAR_NAME} syntax to point to a KiCad configured path
//      If empty, will be auto-selected based on pin_count
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
//      URL link to the supplier page for pin headers
//      this will be added as a KiCad property for BOM export
//    manufacturer_part_number: default is ''
//      Manufacturer part number for pin headers
//      this will be added as a KiCad property for BOM export
//    do_not_populate: default is 'DNP'
//      Do Not Populate flag for pin headers
//      Set to 'DNP' to indicate the manufacturer should not try to place the part automatically
//
// Notes:
// - This is a VIRTUAL footprint - it adds NOTHING to the actual PCB
// - No pads, holes, or silkscreen are generated
// - Only 3D model, BOM entry, and POS file entry are created
// - Use this alongside the mcu_nice_nano footprint for BOM tracking
// - Standard pin headers are 2.54mm pitch, available in various pin counts
// - For nice!nano, typically two 1x12 pin headers are used

module.exports = {
  params: {
    designator: 'H',
    side: 'B',
    include_silkscreen: false,
    pin_count: 12,
    pitch: 2.54,
    model_filename: '',
    model_xyz_offset: [0, 0, 0],
    model_xyz_rotation: [0, 0, 0],
    model_xyz_scale: [1, 1, 1],
    supplier_link: '',
    manufacturer_part_number: '',
    do_not_populate: 'DNP'
  },
  body: p => {
    // Auto-select model filename if not provided
    let modelFilename = p.model_filename;
    if (!modelFilename) {
      modelFilename = '${PATH_TO_SWEEPYWAY_COMPONENT_MODELS}/PinHeader_1x' + p.pin_count + '_P2.54mm_Vertical.step';
    }
    
    const footprint = `
  (footprint "ceoloide:header-preview_nano"
    (layer "${p.side}.Cu")
    ${p.at}
    (property "Reference" "${p.ref}"
      (at 0 2.55 ${p.r})
      ${p.include_silkscreen ? `(layer "${p.side}.SilkS")` : '(layer "F.Fab")'}
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (attr allow_soldermask_bridges)
    ${p.supplier_link ? `    (property "Header Supplier Link" "${p.supplier_link}")` : ''}
    ${p.manufacturer_part_number ? `    (property "Header manufacturer_part_number" "${p.manufacturer_part_number}")` : ''}
    ${p.do_not_populate ? `    (property "Header Do Not Populate" "${p.do_not_populate}")` : ''}
    ${p.pin_count ? `    (property "Header Pin Count" "${p.pin_count}")` : ''}
    ${p.pitch ? `    (property "Header Pitch" "${p.pitch}mm")` : ''}
    ${modelFilename ? `
    (model ${modelFilename}
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
