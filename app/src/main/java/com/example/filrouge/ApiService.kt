package com.example.filrouge

import retrofit2.Response
import retrofit2.http.*

/* -------------
* Déclarations des routes pour le serveur node
-------------- */

interface ApiService {
    @GET("/stock/read")
    suspend fun getStocks(): List<Stock>

    @PUT("/stock/update/{id}")
    suspend fun updateStock(
        @Path("id") id: Int,
        @Body stock: StockUpdateRequest
    ): Response<String>

    @GET("/entrepot/read")
    suspend fun getEntrepots(): List<Entrepot>
}
