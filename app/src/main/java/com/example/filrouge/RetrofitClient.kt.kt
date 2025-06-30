package com.example.filrouge

// RetrofitClient.kt
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

/* -------------
* Déclaration server Node
-------------- */

object RetrofitClient {
    private const val BASE_URL = "http://10.0.2.2:3100/"

    val apiService: ApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }
}