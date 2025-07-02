package com.example.filrouge

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

/* -------------
* Fonctions pour appeler le serveur
-------------- */

class StockViewModel : ViewModel() {

    private val _stocks = MutableStateFlow<List<Stock>>(emptyList())
    val stocks: StateFlow<List<Stock>> = _stocks

    private val _entrepots = MutableStateFlow<List<Entrepot>>(emptyList())
    val entrepots: StateFlow<List<Entrepot>> = _entrepots

    private val _selectedEntrepotId = MutableStateFlow<Int?>(null)
    val selectedEntrepotId: StateFlow<Int?> = _selectedEntrepotId

    fun fetchAll() {
        viewModelScope.launch {
            fetchEntrepots()
            fetchStocks()
        }
    }

    fun fetchStocks() {
        viewModelScope.launch {
            try {
                val result = RetrofitClient.apiService.getStocks()
                _stocks.value = result
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    fun fetchEntrepots() {
        viewModelScope.launch {
            try {
                val result = RetrofitClient.apiService.getEntrepots()
                _entrepots.value = result
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    fun updateStock(stockId: Int, quantite: Int?, valeur: Float?) {
        viewModelScope.launch {
            try {
                val request = StockUpdateRequest(quantite, valeur)
                val response = RetrofitClient.apiService.updateStock(stockId, request)
                when {
                    response.isSuccessful -> {
                        fetchStocks() // recharge les stocks après mise à jour
                    }
                    response.code() == 422 -> {
                        val errorMsg = response.errorBody()?.string() ?: "Erreur de validation"
                        println("Erreur 422: $errorMsg")
                        // Ici, tu peux par exemple émettre un état UI spécifique ou afficher un toast
                    }
                    else -> {
                        println("Erreur update: ${response.code()}")
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }


    fun selectEntrepot(id: Int?) {
        _selectedEntrepotId.value = id
    }

    fun getStocksForSelectedEntrepot(): List<Stock> {
        return _stocks.value.filter { it.id_entrepot == _selectedEntrepotId.value }
    }
}
