-----------
Adicionar api_token na chamada de login [x]

----------
Dados do carro
Marca | Modelo | Ano | Km | Placa (Opt) | Volume do Tanque (Opt) | Chassi (Opt) | Renavam (Opt)

Salvar valor do Seguro? (Posteriormente criar tabela despesa, seguro será um tipo de despesa recorrente!)


Criação do fluxo de despesa
- Criar endpoint /api/src/cars/:carId/expense
    /api/cars/:carId/expenses/
    ├── POST /fuel 
    ├── POST /maintenance
    - POST: /cars/:carId/expenses/fuel
    - Criar schema: user_id, car_id, date, Km, volume (L), price, fuel_type, is_full_tank (bool).

    - POST: /cars/:carId/expenses/maintenance
    - Criar schema: user_id, car_id, date, Km, type, price, local.

- Migration (DDL) + adicionar no _journal.json (entender melhor pra que serve esse journal)


Integrar com IA:
- Criar endpoint dentro de /api/src/ai
    - GET: ai/insight
        - Buscar todos os carros relacionados ao usuário e buscar as despesas relacionadas (maintenance, fuel);
        - Prompt: `gere um insight sobre os dados desse carro.` 
- Criar schema dentro de /api/src/database/schemas/insights
    - Tabela deve conter id (uuid), user_id, type (por exemplo: maintence, fuel), text (onde a resposta da IA ficará salva), expires_at (datetime), max (number).
- Baseado nesse schema, criar o DDL (migration que fica dentro [...]/migrations), novo arquivo 001_insights...
- Criar um /ai-service.ts dentro de /api e nele integrar com gemini

https://github.com/googleapis/js-genai
GEMINI_API_KEY=xxxxxxxxxxx
gemini key ai, adicionar no .env