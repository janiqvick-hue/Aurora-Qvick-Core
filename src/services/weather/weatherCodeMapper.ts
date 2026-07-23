export function mapWmoCodeToFinnish(code: number, isDay: boolean = true): string {
  switch (code) {
    case 0:
      return isDay ? "Selkeää" : "Kirkas yö";
    case 1:
      return "Melko selkeää";
    case 2:
      return "Puolipilvistä";
    case 3:
      return "Pilvistä";
    case 45:
    case 48:
      return "Sumuista";
    case 51:
    case 53:
    case 55:
      return "Kevyttä tihkua";
    case 56:
    case 57:
      return "Jäätävää tihkua";
    case 61:
      return "Kevyttä sadetta";
    case 63:
      return "Sadetta";
    case 65:
      return "Runsasta sadetta";
    case 66:
    case 67:
      return "Jäätävää sadetta";
    case 71:
      return "Kevyttä lumisadetta";
    case 73:
      return "Lumisadetta";
    case 75:
      return "Runsasta lumisadetta";
    case 77:
      return "Lumijyväsiä";
    case 80:
    case 81:
    case 82:
      return "Kuurosadetta";
    case 85:
    case 86:
      return "Lumikuuroja";
    case 95:
    case 96:
    case 99:
      return "Ukkosta";
    default:
      return "Pilvistä";
  }
}
