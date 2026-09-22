/**
 * Robust CSV & Tab-Delimited text parser for Automotive Parts Catalog
 * Designed to handle standard CSV, Excel UTF-8 with BOM, quoted strings, and varied headers.
 */

export interface ParsedCsvRow {
  model: string;
  variant: string;
  year: number;
  part_number: string;
  part_description: string;
  category: string;
  subcategory?: string;
  position?: string;
  notes?: string;
}

export interface ParseResult {
  rows: ParsedCsvRow[];
  totalRows: number;
  validRows: number;
  errors: { rowNumber: number; message: string }[];
}

/**
 * Parses raw CSV string into structured automotive part rows.
 */
export function parsePartsCsv(csvContent: string): ParseResult {
  // Strip BOM if present
  let cleanContent = csvContent;
  if (cleanContent.charCodeAt(0) === 0xfeff) {
    cleanContent = cleanContent.slice(1);
  }

  const lines = splitCsvLines(cleanContent.trim());
  if (lines.length === 0) {
    return { rows: [], totalRows: 0, validRows: 0, errors: [] };
  }

  // Parse header
  const headerFields = parseCsvLine(lines[0]).map((h) => normalizeHeaderName(h));
  const expectedCols = ["model", "variant", "year", "part_number", "part_description", "category"];

  // Verify minimal headers
  const missingCols = expectedCols.filter((col) => !headerFields.includes(col));
  if (missingCols.length > 0) {
    return {
      rows: [],
      totalRows: lines.length - 1,
      validRows: 0,
      errors: [
        {
          rowNumber: 1,
          message: `Missing required header column(s): ${missingCols.join(", ")}. Required: ${expectedCols.join(", ")}`,
        },
      ],
    };
  }

  const rows: ParsedCsvRow[] = [];
  const errors: { rowNumber: number; message: string }[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue; // Skip empty rows

    const values = parseCsvLine(rawLine);
    const rowObj: Record<string, string> = {};

    headerFields.forEach((header, idx) => {
      rowObj[header] = (values[idx] || "").trim();
    });

    const rowNum = i + 1;

    // Validate required fields
    if (!rowObj.model) {
      errors.push({ rowNumber: rowNum, message: "Missing required field: model" });
      continue;
    }
    if (!rowObj.variant) {
      errors.push({ rowNumber: rowNum, message: "Missing required field: variant" });
      continue;
    }
    if (!rowObj.year) {
      errors.push({ rowNumber: rowNum, message: "Missing required field: year" });
      continue;
    }
    if (!rowObj.part_number) {
      errors.push({ rowNumber: rowNum, message: "Missing required field: part_number" });
      continue;
    }
    if (!rowObj.part_description) {
      errors.push({ rowNumber: rowNum, message: "Missing required field: part_description" });
      continue;
    }
    if (!rowObj.category) {
      errors.push({ rowNumber: rowNum, message: "Missing required field: category" });
      continue;
    }

    const parsedYear = parseInt(rowObj.year, 10);
    if (isNaN(parsedYear) || parsedYear < 1980 || parsedYear > 2050) {
      errors.push({ rowNumber: rowNum, message: `Invalid model year: "${rowObj.year}". Must be a 4-digit year (1980–2050).` });
      continue;
    }

    rows.push({
      model: rowObj.model,
      variant: rowObj.variant,
      year: parsedYear,
      part_number: rowObj.part_number,
      part_description: rowObj.part_description,
      category: rowObj.category,
      subcategory: rowObj.subcategory || undefined,
      position: rowObj.position || undefined,
      notes: rowObj.notes || undefined,
    });
  }

  return {
    rows,
    totalRows: lines.length - 1,
    validRows: rows.length,
    errors,
  };
}

/**
 * Splits CSV into logical lines, respecting quoted newlines.
 */
function splitCsvLines(text: string): string[] {
  const lines: string[] = [];
  let currentLine = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      insideQuotes = !insideQuotes;
      currentLine += char;
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && text[i + 1] === "\n") {
        i++; // skip \n of \r\n
      }
      if (currentLine.trim()) {
        lines.push(currentLine);
      }
      currentLine = "";
    } else {
      currentLine += char;
    }
  }

  if (currentLine.trim()) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Parses single CSV line into tokens, respecting quotes and escapes.
 */
function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let currentField = "";
  let insideQuotes = false;
  // Detect tab vs comma
  const delimiter = line.includes("\t") ? "\t" : ",";

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === delimiter && !insideQuotes) {
      fields.push(currentField.trim());
      currentField = "";
    } else {
      currentField += char;
    }
  }

  fields.push(currentField.trim());
  return fields;
}

/**
 * Standardizes common header variations.
 */
function normalizeHeaderName(header: string): string {
  const lower = header.toLowerCase().replace(/[\s\-_]+/g, "_").trim();
  if (lower === "partnumber" || lower === "part_no" || lower === "partno") return "part_number";
  if (lower === "partdescription" || lower === "description" || lower === "part_desc") return "part_description";
  if (lower === "year_model" || lower === "yearmodel" || lower === "model_year") return "year";
  if (lower === "vehicle_model" || lower === "vehicle") return "model";
  if (lower === "vehicle_variant" || lower === "trim") return "variant";
  if (lower === "sub_category") return "subcategory";
  return lower;
}
