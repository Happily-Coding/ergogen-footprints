// Copyright (c) 2023 Marco Massarelli
//
// SPDX-License-Identifier: CC-BY-NC-SA-4.0
//
// To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/
//
// Authors: @ceoloide
//
// Description:
//    Virtual footprint for standoff/spacer BOM/POS/3D preview only.
//    This footprint does NOT add any pads, holes, or silkscreen to the PCB.
//    It only provides:
//    - 3D model for the standoff
//    - BOM entry for standoffs
//    - POS file entry for standoffs
//
//    This is useful for fabrication preview and BOM management when you want
//    to track standoffs separately from the mounting hole footprint.
//
// Params:
//    side: default is F for Front
//      the side on which to place the footprint reference, either F or B
//    include_silkscreen: default is false
//      if true, will include the reference designator on silkscreen
//    screw_diameter: default is m2
//      Screw diameter type: m2, m2.5, m3
//      Used for automatic model selection
//    length: default is 6
//      Standoff length in mm: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
//      Used for automatic model selection and Z-offset calculation
//    model_filename: default is '' (auto-selected)
//      Path to the 3D model STEP, WRL, or STL file for the standoff
//      Use the ${VAR_NAME} syntax to point to a KiCad configured path
//      If empty, will be auto-selected based on screw_diameter and length
//    model_xyz_offset: default is [0, 0, 0] (auto-calculated)
//      xyz offset (in mm), used to adjust the position of the 3d model
//      relative the footprint. If [0, 0, 0], Z offset is auto-calculated
//      based on length (length/2 to center the standoff vertically)
//    model_xyz_scale: default is [1, 1, 1]
//      xyz scale, used to adjust the size of the 3d model relative its
//      original size
//    model_xyz_rotation: default is [0, 0, 0]
//      xyz rotation (in degrees), used to adjust the orientation of the 3d
//      model relative the footprint
//    supplier_link: default is ''
//      URL link to the supplier page for standoffs
//      this will be added as a KiCad property for BOM export
//    manufacturer_part_number: default is ''
//      Manufacturer part number for standoffs
//      this will be added as a KiCad property for BOM export
//    do_not_populate: default is 'DNP'
//      Do Not Populate flag for standoffs
//      Set to 'DNP' to indicate the manufacturer should not try to place the part automatically
//
// Notes:
// - This is a VIRTUAL footprint - it adds NOTHING to the actual PCB
// - No pads, holes, or silkscreen are generated
// - Only 3D model, BOM entry, and POS file entry are created
// - Use this alongside the mounting_hole_npth footprint for BOM tracking
// - M2 standoffs are available in 1-10mm lengths
// - M2.5 and M3 standoffs are not currently available in the default models

module.exports = {
  params: {
    designator: 'ST',
    side: 'F',
    include_silkscreen: false,
    screw_diameter: 'm2',
    length: 6,
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
      if (p.screw_diameter === 'm2') {
        modelFilename = '${PATH_TO_SWEEPYWAY_COMPONENT_MODELS}/93020A101_Low-Strength_Steel_Coupling_Nut_m2_standoff_' + p.length + 'mm.wrl';
      }
      // Add m2.5 and m3 support when models are available
    }
    
    // Auto-calculate Z offset if not provided (center standoff vertically)
    // Default Z offset places the standoff centered at length/2 above the footprint origin
    let zOffset = p.model_xyz_offset[2];
    if (p.model_xyz_offset[0] === 0 && p.model_xyz_offset[1] === 0 && p.model_xyz_offset[2] === 0) {
      zOffset = p.length / 2;
    }
    
    const footprint = `
  (footprint "ceoloide:standoff-preview"
    (layer "${p.side}.Cu")
    ${p.at}
    (property "Reference" "${p.ref}"
      (at 0 2.55 ${p.r})
      ${p.include_silkscreen ? `(layer "${p.side}.SilkS")` : '(layer "F.Fab")'}
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (attr allow_soldermask_bridges)
    ${p.supplier_link ? `    (property "Standoff Supplier Link" "${p.supplier_link}")` : ''}
    ${p.manufacturer_part_number ? `    (property "Standoff manufacturer_part_number" "${p.manufacturer_part_number}")` : ''}
    ${p.do_not_populate ? `    (property "Standoff Do Not Populate" "${p.do_not_populate}")` : ''}
    ${p.length ? `    (property "Standoff Length" "${p.length}mm")` : ''}
    ${p.screw_diameter ? `    (property "Standoff Screw Diameter" "${p.screw_diameter}")` : ''}
    ${modelFilename ? `
    (model ${modelFilename}
      (offset (xyz ${p.model_xyz_offset[0]} ${p.model_xyz_offset[1]} ${zOffset}))
      (scale (xyz ${p.model_xyz_scale[0]} ${p.model_xyz_scale[1]} ${p.model_xyz_scale[2]}))
      (rotate (xyz ${p.model_xyz_rotation[0]} ${p.model_xyz_rotation[1]} ${p.model_xyz_rotation[2]}))
    )
    ` : ''}
  )
    `

    return footprint
  }
}
