export async function handler() {

const apiKey = process.env.GEMINI_API_KEY;

const prompt = "Write an SEO article about studying in Europe for Bangladeshi students.";

const response = await fetch(
"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key="+apiKey,
{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
contents:[{parts:[{text:prompt}]}]
})
}
);

const data = await response.json();

return {
statusCode:200,
body:JSON.stringify(data)
};

}
