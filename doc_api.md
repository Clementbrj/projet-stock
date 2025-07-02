
# 📦 API Client – `ApiService` (FilRouge)

Ce module définit l'interface `ApiService` utilisée pour interagir avec un serveur Node.js via HTTP grâce à Retrofit. Il fournit des fonctions suspendues (coroutines) permettant d'accéder à différentes ressources telles que les **stocks** et les **entrepôts**.

## 📚 Endpoints disponibles

### 🔍 `GET /stock/read`

**Description :**  
Récupère la liste complète des stocks disponibles.

**Signature :**
```kotlin
@GET("/stock/read")
suspend fun getStocks(): List<Stock>
```

**Retour :**  
Une liste d’objets `Stock`.

---

### 🔄 `PUT /stock/update/{id}`

**Description :**  
Met à jour les informations d’un stock existant via son identifiant.

**Signature :**
```kotlin
@PUT("/stock/update/{id}")
suspend fun updateStock(
    @Path("id") id: Int,
    @Body stock: StockUpdateRequest
): Response<String>
```

**Paramètres :**  
- `id` (Int) – L'identifiant du stock à mettre à jour.  
- `stock` (StockUpdateRequest) – Le corps de la requête contenant les nouvelles valeurs du stock.

**Retour :**  
Un objet `Response<String>` indiquant le succès ou l’échec de l’opération.

---

### 🏢 `GET /entrepot/read`

**Description :**  
Récupère la liste des entrepôts enregistrés.

**Signature :**
```kotlin
@GET("/entrepot/read")
suspend fun getEntrepots(): List<Entrepot>
```

**Retour :**  
Une liste d’objets `Entrepot`.

