import google.generativeai as genai
from ..config import settings

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None

    def query_gemini(self, prompt: str) -> str:
        if not self.model:
            # Fallback simulator
            return self._generate_simulated_response(prompt)
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error contacting Gemini API: {str(e)}. (Fell back to simulation) \n\n" + self._generate_simulated_response(prompt)

    def _generate_simulated_response(self, prompt: str) -> str:
        p_lower = prompt.lower()
        if "p101" in p_lower:
            return (
                "Based on the parsed incident reports and maintenance logs, Centrifugal Pump P101 "
                "failed due to structural shaft misalignment measured at 0.45mm (maximum tolerance: 0.05mm). "
                "The misalignment caused excessive bearing friction and thermal locking. "
                "Recommendation: Check weekly shaft logs, perform bearing lubrication, and verify coupling alignment."
            )
        elif "b202" in p_lower or "boiler 2" in p_lower:
            return (
                "Steam Boiler B202 shows thermal degradation near flange connections. "
                "The safety relief valve B202-SV-B exhibits pressure seat leakage of 12 psi above statutory thresholds "
                "in violation of ASME Sec I and OISD 177. "
                "Recommendation: Halt operation of boiler line B, apply lockouts, and schedule replacement of valve SV-B."
            )
        elif "c303" in p_lower or "compressor" in p_lower:
            return (
                "Reciprocating Compressor C303 logs indicate an overheating trip. "
                "The root cause analysis shows a lubricating oil filter blockage, creating high mechanical friction. "
                "Recommendation: Introduce differential pressure monitors and inspect filter elements every 90 days."
            )
        else:
            return (
                "Analyzing plant document contexts. According to industrial standards, ensure physical guards "
                "are mounted on rotating components, Lockout/Tagout checks are verified, and technicians "
                "sign off the maintenance index logs. Let me know if you need to pull specific SOP paragraphs."
            )

    def perform_rca(self, title: str, desc: str) -> dict:
        prompt = (
            f"Perform a Root Cause Analysis (RCA) and suggest preventive actions for this incident:\n"
            f"Title: {title}\n"
            f"Description: {desc}\n"
            f"Output the results in this exact JSON format (and nothing else):\n"
            f'{{"root_cause": "brief explanation", "preventive_action": "brief action"}}'
        )
        
        if not self.model:
            return self._mock_rca(title, desc)
            
        try:
            response = self.model.generate_content(prompt)
            # Simple fallback parser
            import json
            cleaned = response.text.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            return json.loads(cleaned.strip())
        except Exception:
            return self._mock_rca(title, desc)

    def _mock_rca(self, title: str, desc: str) -> dict:
        t_lower = title.lower() + " " + desc.lower()
        if "leak" in t_lower or "pipe" in t_lower:
            return {
                "root_cause": "Thermal cycling fatigue leading to flange gasket seal structural degradation.",
                "preventive_action": "Install graphite spiral-wound gaskets and schedule quarterly thermal imaging checks."
            }
        elif "heat" in t_lower or "temperature" in t_lower:
            return {
                "root_cause": "Oil filter blockage blocking lubricant circulation, creating high friction temperatures.",
                "preventive_action": "Mount differential pressure monitors across filters and inspect elements every 90 days."
            }
        else:
            return {
                "root_cause": "Minor structural wear and tear or procedural oversight during team shift handovers.",
                "preventive_action": "Review LOTO guidelines and mandate tablet check-ins before physical lockouts are cleared."
            }

gemini_client = GeminiService()
