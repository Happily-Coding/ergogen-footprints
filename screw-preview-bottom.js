// Copyright (c) 2023 Marco Massarelli
//
// SPDX-License-Identifier: CC-BY-NC-SA-4.0
//
// To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/
//
// Authors: @ceoloide
//
// Description:
//    Virtual footprint for screw BOM/POS/3D preview only.
//    This footprint does NOT add any pads, holes, or silkscreen to the PCB.
//    It only provides:
//    - 3D model for the screw
//    - BOM entry for screws
//    - POS file entry for screws
//
//    This is the BOTTOM screw that goes below the case, holding the case to the standoff.
//    The sandwich structure is: screw (top) → plate → standoff → case → screw (bottom)
//
// Params:
//    side: default is F for Front
//      the side on which to place the footprint reference, either F or B
//    include_silkscreen: default is false
//      if true, will include the reference designator on silkscreen
//    screw_diameter: default is m2
//      Screw diameter type: m2, m2.5, m3
//      Used for automatic model selection
//    length: default is 5
//      Screw length in mm: 2, 3, 4, 5, 6, 8, 10, 12
//      Used for automatic model selection
//    head_type: default is pan
//      Head type: pan, low_socket, flat
//      Used for automatic model selection
//      - pan: Pan head Phillips screws (M2 only)
//      - low_socket: Low-profile socket head screws (M2 only)
//      - flat: Countersunk flat head screws (M2.5, M3 only)
//    case_bottom_thickness: default is 3
//      Thickness of the case bottom in mm, used for automatic Z-offset calculation
//    model_filename: default is '' (auto-selected)
//      Path to the 3D model STEP, WRL, or STL file for the screw
//      Use the ${VAR_NAME} syntax to point to a KiCad configured path
//      If empty, will be auto-selected based on screw_diameter, head_type, and length
//    model_xyz_offset: default is [0, 0, 0] (auto-calculated)
//      xyz offset (in mm), used to adjust the position of the 3d model
//      relative the footprint. If [0, 0, 0], Z offset is auto-calculated
//      based on case_bottom_thickness and screw head height (negative value)
//    model_xyz_scale: default is [1, 1, 1]
//      xyz scale, used to adjust the size of the 3d model relative its
//      original size
//    model_xyz_rotation: default is [0, 0, 0]
//      xyz rotation (in degrees), used to adjust the orientation of the 3d
//      model relative the footprint
//    supplier_link: default is ''
//      URL link to the supplier page for screws
//      this will be added as a KiCad property for BOM export
//    manufacturer_part_number: default is ''
//      Manufacturer part number for screws
//      this will be added as a KiCad property for BOM export
//    do_not_populate: default is 'DNP'
//      Do Not Populate flag for screws
//      Set to 'DNP' to indicate the manufacturer should not try to place the part automatically
//
// Notes:
// - This is a VIRTUAL footprint - it adds NOTHING to the actual PCB
// - No pads, holes, or silkscreen are generated
// - Only 3D model, BOM entry, and POS file entry are created
// - Use this alongside the mounting_hole_npth footprint for BOM tracking
// - The Z offset is calculated to place the screw below the case bottom
// - M2 pan head screws: lengths 2, 3, 4, 5, 6, 8, 10, 12mm
// - M2 low-profile socket head screws: lengths 4, 5, 6, 8, 10, 12mm
// - M2.5 flat head screws: lengths 4, 5, 6, 8, 10, 12mm
// - M3 flat head screws: lengths 4, 5, 6, 8, 10, 12mm

module.exports = {
  params: {
    designator: 'SC',
    side: 'F',
    include_silkscreen: false,
    screw_diameter: 'm2',
    length: 5,
    head_type: 'pan',
    case_bottom_thickness: 3,
    model_filename: '',
    model_xyz_offset: [0, 0, 0],
    model_xyz_rotation: [0, 0, 0],
    model_xyz_scale: [1, 1, 1],
    supplier_link: '',
    manufacturer_part_number: '',
    do_not_populate: 'DNP'
  },
  body: p => {
    // Model mapping for automatic selection
    const screwModels = {
      m2: {
        pan: {
          2: '92005A010_Steel_Pan_Head_Phillips_Screw_m2_2mm.STEP',
          3: '95836A103_Black-Oxide_18-8_Stainless_Steel_Pan_Head_Phillips_Screw_m2_3mm.STEP',
          4: '92000A011_Passivated_18-8_Stainless_Steel_Pan_Head_Phillips_Screw_m2_4mm.STEP',
          5: '92000A012_Passivated_18-8_Stainless_Steel_Pan_Head_Phillips_Screw_m2_5mm.STEP',
          6: '92000A013_Passivated_18-8_Stainless_Steel_Pan_Head_Phillips_Screw_m2_6mm.STEP',
          8: '92000A015_Passivated_18-8_Stainless_Steel_Pan_Head_Phillips_Screw_m2_8mm.STEP',
          10: '92000A017_Passivated_18-8_Stainless_Steel_Pan_Head_Phillips_Screw_m2_10mm.STEP',
          12: '92000A019_Passivated_18-8_Stainless_Steel_Pan_Head_Phillips_Screw_m2_12mm.STEP'
        },
        low_socket: {
          4: '93070A274_Alloy_Steel_Low-Profile_Socket_Head_Screw_m2_4mm.STEP',
          5: '93070A275_Alloy_Steel_Low-Profile_Socket_Head_Screw_m2_5mm.STEP',
          6: '93070A276_Alloy_Steel_Low-Profile_Socket_Head_Screw_m2_6mm.STEP',
          8: '93070A277_Alloy_Steel_Low-Profile_Socket_Head_Screw_m2_8mm.STEP',
          10: '93070A278_Alloy_Steel_Low-Profile_Socket_Head_Screw_m2_10mm.STEP',
          12: '92855A841_18-8_Stainless_Steel_Low-Profile_Socket_Head_Screws_m2_12mm.STEP'
        }
      },
      m2_5: {
        flat: {
          4: 'cross_recessed_phillips_countersunk_flat_head_M2.5x04.step',
          5: 'cross_recessed_phillips_countersunk_flat_head_M2.5x05.step',
          6: 'cross_recessed_phillips_countersunk_flat_head_M2.5x06.step',
          8: 'cross_recessed_phillips_countersunk_flat_head_M2.5x08.step',
          10: 'cross_recessed_phillips_countersunk_flat_head_M2.5x10.step',
          12: 'cross_recessed_phillips_countersunk_flat_head_M2.5x12.step'
        }
      },
      m3: {
        flat: {
          4: 'cross_recessed_phillips_countersunk_flat_head_M3x04.step',
          5: 'cross_recessed_phillips_countersunk_flat_head_M3x05.step',
          6: 'cross_recessed_phillips_countersunk_flat_head_M3x06.step',
          8: 'cross_recessed_phillips_countersunk_flat_head_M3x08.step',
          10: 'cross_recessed_phillips_countersunk_flat_head_M3x10.step',
          12: 'cross_recessed_phillips_countersunk_flat_head_M3x12.step'
        }
      }
    };
    
    // Approximate screw head heights for Z-offset calculation
    const screwHeadHeights = {
      m2: {
        pan: 1.2,
        low_socket: 1.0
      },
      m2_5: {
        flat: 1.5
      },
      m3: {
        flat: 2.0
      }
    };
    
    // Auto-select model filename if not provided
    let modelFilename = p.model_filename;
    if (!modelFilename) {
      const diameterModels = screwModels[p.screw_diameter];
      if (diameterModels && diameterModels[p.head_type]) {
        const selectedModel = diameterModels[p.head_type][p.length];
        if (selectedModel) {
          modelFilename = '${PATH_TO_SWEEPYWAY_COMPONENT_MODELS}/' + selectedModel;
        }
      }
    }
    
    // Auto-calculate Z offset if not provided
    // For bottom screw: position below the case, screw head at the bottom
    // Z is negative (below PCB), screw points upward (rotated 180°)
    let zOffset = p.model_xyz_offset[2];
    if (p.model_xyz_offset[0] === 0 && p.model_xyz_offset[1] === 0 && p.model_xyz_offset[2] === 0) {
      const headHeight = screwHeadHeights[p.screw_diameter]?.[p.head_type] || 1.2;
      // Place screw head below the case bottom
      zOffset = -p.case_bottom_thickness - headHeight;
    }
    
    // Rotation: 180° around X axis to make screw point upward
    let xRotation = p.model_xyz_rotation[0];
    let yRotation = p.model_xyz_rotation[1];
    let zRotation = p.model_xyz_rotation[2];
    if (p.model_xyz_rotation[0] === 0 && p.model_xyz_rotation[1] === 0 && p.model_xyz_rotation[2] === 0) {
      xRotation = 180;
    }
    
    const footprint = `
  (footprint "ceoloide:screw-preview-bottom"
    (layer "${p.side}.Cu")
    ${p.at}
    (property "Reference" "${p.ref}"
      (at 0 2.55 ${p.r})
      ${p.include_silkscreen ? `(layer "${p.side}.SilkS")` : '(layer "F.Fab")'}
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (attr allow_soldermask_bridges)
    ${p.supplier_link ? `    (property "Screw Supplier Link" "${p.supplier_link}")` : ''}
    ${p.manufacturer_part_number ? `    (property "Screw manufacturer_part_number" "${p.manufacturer_part_number}")` : ''}
    ${p.do_not_populate ? `    (property "Screw Do Not Populate" "${p.do_not_populate}")` : ''}
    ${p.length ? `    (property "Screw Length" "${p.length}mm")` : ''}
    ${p.screw_diameter ? `    (property "Screw Diameter" "${p.screw_diameter}")` : ''}
    ${p.head_type ? `    (property "Screw Head Type" "${p.head_type}")` : ''}
    ${modelFilename ? `
    (model ${modelFilename}
      (offset (xyz ${p.model_xyz_offset[0]} ${p.model_xyz_offset[1]} ${zOffset}))
      (scale (xyz ${p.model_xyz_scale[0]} ${p.model_xyz_scale[1]} ${p.model_xyz_scale[2]}))
      (rotate (xyz ${xRotation} ${yRotation} ${zRotation}))
    )
    ` : ''}
  )
    `

    return footprint
  }
}
